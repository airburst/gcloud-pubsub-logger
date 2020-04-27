/* global __dirname, require, module */
const path = require('path');
const fs = require('file-system');

const config = {
  target: 'node',
  entry: './src/index.js',
  devtool: 'source-map',
  context: __dirname,
  node: {
    __filename: true,
    __dirname: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'migration-api',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        exclude: /(node_modules)/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
    extensions: ['.js'],
  },
  externals: fs.readdirSync('node_modules').filter(x => x !== '.bin'),
};

module.exports = config;
