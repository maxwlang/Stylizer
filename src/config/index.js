const config = {
    database: require('./database'),
    logs: require('./logs'),
    debug: require('./debug'),
    discord: require('./discord'),
    sentry: require('./sentry'),
};

module.exports = config;
