const { createLogger, format, transports } = require("winston");
require("express-async-errors");

module.exports = function () {
  createLogger({
    level: "info",
    format: format.json(),

    transports: [
      new transports.Console({
        level: "info",
        format: format.combine(format.colorize(), format.simple()),
      }),
    ],
  });
};
