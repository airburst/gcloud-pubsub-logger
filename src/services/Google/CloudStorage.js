/**
 * This module requires a service account to work.
 * The credentials are stored in service.json and an environment variable
 * called GOOGLE_APPLICATION_CREDENTIALS points to its location
 */
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';
import logger from '../../logger';

const getPath = filename => path.join(__dirname, '../../files/', filename);

export default class Google {
  constructor(bucket) {
    this.storage = new Storage();
    this.bucket = this.storage.bucket(bucket);
  }

  upload(filename) {
    const filePath = getPath(filename);

    return new Promise((resolve, reject) => {
      this.bucket
        .upload(filePath)
        .then(() => resolve())
        .catch((err) => {
          logger.error(`Unable to write ${filename} to Google bucket`);
          reject(Error(err.message));
        });
    });
  }

  folders(prefix) {
    return new Promise((resolve, reject) => {
      this.bucket.getFiles(
        { prefix, autoPaginate: false },
        (err, files) => {
          if (err) {
            reject(err);
          } else {
            // Parse out the folder elements
            const folders = files.map(f => f.name.replace(prefix, ''))
              .filter(f => f.indexOf('/') > -1)
              .map(ff => ff.match(/(\w+\/)/g)[0]);
            resolve(Array.from(new Set(folders)));
          }
        },
      );
    });
  }

  files(prefix) {
    return new Promise((resolve, reject) => {
      this.bucket.getFiles(
        { prefix, delimiter: '/', autoPaginate: false },
        (err, files) => {
          if (err) {
            reject(err);
          } else {
            resolve(files.map(f => f.name));
          }
        },
      );
    });
  }

  download(filename) {
    const localFilename = path.join(__dirname, '../../files/', path.basename(filename));

    return new Promise((resolve, reject) => {
      this.bucket
        .file(filename)
        .createReadStream()
        .on('error', err => reject(err))
        .on('end', () => resolve())
        .pipe(fs.createWriteStream(localFilename));
    });
  }
}

/**
  Usage examples:

  const bucket = process.env.BUCKET;
  const google = new Google(bucket);

  // All upload and download paths are relative to /files
  await google.upload('validation.png')
    .then(() => console.log('File uploaded'))
    .catch(err => console.log(err.message));

  await google.download('path/to/file.xml')
    .then(() => console.log('File downloaded'))
    .catch(err => console.log(err.message));

  // Folder and file prefixes must end with a slash
  google.folders('Safer_Choices_Trial_2018-06-01/')
    .then((folders) => { console.log(folders); })
    .catch(err => console.log(err.message));

  google.files('Chilston_pilot/structured/')
    .then((files) => { console.log(files); })
    .catch(err => console.log(err.message));
 */
