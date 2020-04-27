/* eslint-disable max-len */
import logger from '../../../logger';
import { deviceParser } from './deviceParser';

const logHandler = async (message) => {
  const {
    id, data, attributes, publishTime
  } = message;

  logger.info(
    `Message: id="${id}"; data="${data}"; attributes="${JSON.stringify(attributes)}"; publishTime="${publishTime}"`,
  );

  message.ack();
};

const dataHandler = async (message) => {
  const { data } = message;

  try {
    const d = JSON.parse(data);
    const shortValue = {
      deviceEui: d.obj.data.origin.endDevice.devEui,
      motion: d.obj.data.occupancy,
      payload: d.obj.data.payload,
      // payload: deviceParser(d.obj.data.payload),
    };

    // Filter
    if (shortValue.deviceEui === '00137A10000030D3') {
      shortValue.type = '🚀 DO SOMETHING';
      if (shortValue.motion) {
        logger.info(JSON.stringify(shortValue));
      }
    } else if (shortValue.deviceEui === '00137A10000030D4') {
      shortValue.type = '🚀 DO SOMETHING ELSE';
      if (shortValue.motion) {
        logger.info(JSON.stringify(shortValue));
      }
    } else {
      logger.info(JSON.stringify(shortValue));
    }
  } catch (e) {
    console.log('Error', e.message);
  }

  message.ack();
};

// Convention is { TOPIC: { ...handlers } }
export default (bus, topic) => ({
  [topic]: {
    MARK_LOGGER_SUBSCRIPTION: logHandler,
    // MARK_LOGGER: dataHandler,
  },
});
