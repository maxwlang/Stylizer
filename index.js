const { AkairoClient, } = require('discord-akairo');
const Sentry = require('@sentry/node');

const config = require('./src/config');
// const events = require('./src/events');
// const messages = require('./src/messages');

// Initialize Sentry error handler if enabled
if (config.sentry.enabled) {
    Sentry.init({ dsn: `https://${config.sentry.key}@${config.sentry.ingestNode}.ingest.sentry.io/${config.sentry.project}`, });
} else {
    console.warn('Sentry is not logging errors.');
}

console.log(config);

class Stylizer extends AkairoClient {
    constructor() {
        super({
            ownerID: '707022657354203180', // or array
        }, {
            disableMentions: 'everyone',
        });
    }
}
console.log('hello');
const client = new Stylizer();
client.login(config.discord.token);
