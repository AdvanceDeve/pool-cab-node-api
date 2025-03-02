const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

// Ensure logs directory exists
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Winston Logger Configuration
const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({ filename: path.join(logDir, "api.log") }), // Logs saved in logs/api.log
        new transports.Console()
    ]
});

module.exports = logger;
