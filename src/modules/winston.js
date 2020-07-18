const { createLogger, format, transports, } = require('winston');
const { logs, } = require('../config');

const {
    combine,
    colorize,
    printf,
    timestamp,
    label,
} = format;

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: (() => {
        const transportStorage = [];

        // Conditionally log outputs to files
        if (logs.files.errors) transportStorage.push(new transports.File({ filename: './data/logs/error.log', level: 'error', }));
        if (logs.files.warnings) transportStorage.push(new transports.File({ filename: './data/logs/warnings.log', level: 'warning', }));
        if (logs.files.info) transportStorage.push(new transports.File({ filename: './data/logs/info.log', level: 'info', }));
        if (logs.files.combined) transportStorage.push(new transports.File({ filename: './data/logs/combined.log', }));

        // Always log to console
        transportStorage.push(new transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'MM/DD/YYYY hh:mm:ss A', }),
                label({ label: '', }), // Optional label
                printf(({
                    timestamp,
                    label,
                    level,
                    message,
                }) => `[${timestamp}][Stylizer]${label}[${level}]: ${message}`)
            ),
        }));

        return transportStorage;
    })(),
});

module.exports = logger;
