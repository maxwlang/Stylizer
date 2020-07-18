// Node modules
const {
    AkairoClient,
    CommandHandler,
    ListenerHandler,
    InhibitorHandler,
} = require('discord-akairo');
const Sentry = require('@sentry/node');

// Vital local resources
const {
    sentry,
    discord,
} = require('../src/config');
const logger = require('../src/modules/winston');

// We've successfully reached our bot core code.
logger.info(`${discord.name} starting up!`);

// Initialize Sentry error handler if enabled
if (sentry.enabled) {
    Sentry.init({ dsn: `https://${sentry.key}@${sentry.ingestNode}.ingest.sentry.io/${sentry.project}`, });
} else {
    console.warn('Sentry is not logging errors.');
}

class Stylizer extends AkairoClient {
    constructor() {
        super({
            ownerID: discord.owners,
        }, {
            disableMentions: 'everyone',
        });

        // Commands
        this.commandHandler = new CommandHandler(this, {
            directory: './src/commands/',
            prefix: discord.prefix,
        });

        // Inhibitors
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './src/inhibitors/',
        });

        // Listeners
        this.listenerHandler = new ListenerHandler(this, {
            directory: './src/listeners/',
        });

        // Load
        this.commandHandler.loadAll();
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.inhibitorHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler,
        });
        this.listenerHandler.loadAll();
    }
}

const client = new Stylizer();
if (!discord.sharding.enabled) client.login(discord.token).catch(logger.error);
