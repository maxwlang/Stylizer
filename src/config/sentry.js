const debug = require('./debug');

const sentry = {
    enabled: true,
    enabledOnDev: false,

    key: '91136e81a820428c806fe364d3087059',
    project: '5343623',
    ingestNode: 'o233196',
};

// Handle dev check here
if ((sentry.enabled && !sentry.enabledOnDev) && debug.isDevelopment) sentry.enabled = false;

module.exports = sentry;
