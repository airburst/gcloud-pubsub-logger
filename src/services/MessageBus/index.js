import dotenv from 'dotenv';
import logger from '../../logger';
import CloudPubSub from '../Google/CloudPubSub';
import messageHandlers from './messageHandlers';

dotenv.config();

const projectId = process.env.MESSAGE_BUS_PROJECT_ID;
// eslint-disable-next-line prefer-spread
const flatten = (arrays) => [].concat.apply([], arrays);

// Create promises to create all subscriptions
// Ensure that old subscriptions are cleared first
const createTopics = (bus, handlers) =>
  Object.entries(handlers).map(async ([topicName]) => {
    await bus.createTopic(topicName);
    logger.info(`Message bus created topic ${topicName}`);
  });

const subscribePromises = (bus, handlers) =>
  flatten(Object.entries(handlers).map(([topicName, topicHandlers]) =>
    Object.entries(topicHandlers).map(async ([name, handler]) => {
      await bus.unsubscribe(name, handler);
      await bus.subscribe(topicName, name, handler);
      logger.info(`Message bus subscribed to ${name} on topic ${topicName}`);
    })));

const unsubscribePromises = (bus, handlers) =>
  flatten(Object.entries(handlers).map(([_, topicHandlers]) =>
    Object.entries(topicHandlers).map(async ([name, handler]) => {
      await bus.unsubscribe(name, handler);
      logger.info(`Message bus unsubscribed from ${name}`);
    })));

class MessageBus {
  constructor() {
    this.topic = null;
    this.bus = new CloudPubSub(projectId);
    this.handlers = [];
  }

  init({ topic }) {
    this.topic = topic;
    return new Promise(async (resolve, reject) => {
      // Create topics and subscriptions
      logger.info('Message bus initialising...');
      try {
        this.handlers = this.enhanceHandlers(messageHandlers);
        await Promise.all(createTopics(this.bus, this.handlers));
        await Promise.all(subscribePromises(this.bus, this.handlers));
        logger.info('Message bus initialised');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  list() {
    return this.bus.listAllTopics();
  }

  async end() {
    return new Promise(async (resolve, reject) => {
      await Promise.all(unsubscribePromises(this.bus, this.handlers));
      logger.info('Message bus subscriptions ended');
      resolve();
    });
  }

  publish(topic, data, params) {
    return this.bus.publishMessage(topic, data, params);
  }

  enhanceHandlers(handlers) {
    // Pass the ability to publish new messages to handlers
    return handlers(this.bus, this.topic);
  }
}

// Export a singleton
export default new MessageBus();
