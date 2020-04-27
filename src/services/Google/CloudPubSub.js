import { PubSub } from '@google-cloud/pubsub';

class CloudPubSub {
  constructor(projectId) {
    this.projectId = projectId;
    this.pubsub = new PubSub();
  }

  async listAllTopics() {
    const [topics] = await this.pubsub.getTopics();
    return topics.map((topic) => topic.name);
  }

  async createTopic(topicName) {
    // Create the topic: fails with code 6 if the topic already exists
    try {
      await this.pubsub.createTopic(topicName);
      return { error: null, success: true };
    } catch (err) {
      if (err.code && err.code === 6) {
        // Topic already exists
        return { error: null, success: true };
      }
      return {
        error: err.details ? err.details : err,
        success: false,
      };
    }
  }

  async deleteTopic(topicName) {
    try {
      await this.pubsub.topic(topicName).delete();
      return { error: null, success: true };
    } catch (err) {
      return { error: err, success: false };
    }
  }

  async publishMessage(topicName, data, customAttributes) {
    if (!topicName || !data) {
      return { error: 'No data to publish' };
    }
    const dataBuffer = Buffer.from(data);
    let messageId;

    try {
      if (!customAttributes) {
        messageId = await this.pubsub.topic(topicName).publish(dataBuffer);
      } else {
        messageId = await this.pubsub.topic(topicName).publish(dataBuffer, customAttributes);
      }
      return { error: null, id: messageId };
    } catch (err) {
      return { error: err };
    }
  }

  async subscribe(topicName, subscriptionName, messageHandler) {
    try {
      await this.pubsub.topic(topicName).createSubscription(subscriptionName);
      this.pubsub.subscription(subscriptionName).on('message', messageHandler);
      return { error: null, success: true };
    } catch (err) {
      if (err.code && err.code === 6) {
        // Subscription already exists
        return { error: null, success: true };
      }
      return { error: err };
    }
  }

  async unsubscribe(subscriptionName, messageHandler) {
    try {
      this.pubsub.subscription(subscriptionName).removeListener('message', messageHandler);
      await this.pubsub.subscription(subscriptionName).delete();
      return { error: null, success: true };
    } catch (err) {
      return { error: err };
    }
  }

  async listSubscriptions() {
    const [subscriptions] = await this.pubsub.getSubscriptions();
    return subscriptions.map((subscription) => subscription.name);
  }
}

export default CloudPubSub;
