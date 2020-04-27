// Import the Google Cloud client library using default credentials
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery();

const query = async () => {
  const sql = `select fPort, data
  from \`chirpstack.chirpstack_appserver\`
  limit 10;`;

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  // Location must match that of the dataset(s) referenced in the query.
  const options = {
    query: sql,
    location: 'europe-west2',
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  // Print the results
  console.log('Rows:');
  // rows.forEach((row) => console.log(row));
  console.log(JSON.stringify(rows, null, 2));
};

export default query;
