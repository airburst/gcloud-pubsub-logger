import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { version } from '../package.json';
import logger from './logger';
import bus from './services/MessageBus';
import query from './services/Google/BigQuery';

dotenv.config();

const port = process.env.PORT || 3001;
const topic = process.env.TOPIC || 'TEST_TOPIC';

// Configure server
const app = express();

// Add server middleware
app.use(bodyParser.json({ limit: '4mb' }));
app.use(compression());
app.disable('x-powered-by');
const httpServer = http.createServer(app);

// Handle termination
process.on('SIGINT', async () => {
  await bus.end();
  console.log('');
  logger.info('MQ logger killed with SIGINT');
  process.exit(0);
});

// Start the socket and graphQl servers
httpServer.listen({ port }, async () => {
  // Initialise message bus
  await bus.init({ topic });

  // await (query());


  // Start server
  logger.info(`💬 PubSub logger version ${version} ready at localhost:${port}`);
});
