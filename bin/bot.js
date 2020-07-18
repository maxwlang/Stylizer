// Node modules
const { AkairoClient, } = require('discord-akairo');
const Sentry = require('@sentry/node');

// Vital local resources
const {
    sentry,
    discord,
} = require('../src/config');
const logger = require('../src/modules/winston');

// We've successfully reached our bot core code.
logger.info('Stylizer starting up!');

// Initialize Sentry error handler if enabled
if (sentry.enabled) {
    Sentry.init({ dsn: `https://${sentry.key}@${sentry.ingestNode}.ingest.sentry.io/${sentry.project}`, });
} else {
    console.warn('Sentry is not logging errors.');
}

class Stylizer extends AkairoClient {
    constructor() {
        super({
            ownerID: '707022657354203180', // or array
        }, {
            disableMentions: 'everyone',
        });
    }
}

const client = new Stylizer();
client.login(discord.token);
