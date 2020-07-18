const config = {
    db: require('./db'),
    debug: require('./debug'),
    discord: require('./discord'),
    logs: require('./logs'),
    sentry: require('./sentry'),
};

module.exports = config;
