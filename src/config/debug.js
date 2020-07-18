const debug = {
    isProduction: process.env.JS_ENVIRONMENT === 'PRODUCTION',
    isStaging: process.env.JS_ENVIRONMENT === 'STAGING',
    isDevelopment: process.env.JS_ENVIRONMENT === 'DEVELOPMENT',
};

module.exports = debug;
