import winston from 'winston';

require('winston-daily-rotate-file');

const consoleTransport = new (winston.transports.Console)({
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.simple(),
  ),
});

const dailyRotateFileTransport = new (winston.transports.DailyRotateFile)({
  name: 'file',
  // datePattern: '.yyyy-MM-dd',
  filename: 'logs/topic-messages.log',
  handleExceptions: true,
  humanReadableUnhandledException: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.simple(),
  ),
});

export default winston.createLogger({
  level: 'info',
  transports: [
    consoleTransport,
    dailyRotateFileTransport,
  ],
});
