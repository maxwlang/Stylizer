// Node modules
const {
    AkairoClient,
    CommandHandler,
    ListenerHandler,
    InhibitorHandler,
} = require('discord-akairo');
const Sentry = require('@sentry/node');
const { Sequelize, } = require('sequelize');

// Vital local resources
const {
    sentry,
    discord,
    database,
} = require('../src/config');
const logger = require('../src/modules/winston');

// Initialize Sentry error handler if enabled
if (sentry.enabled) {
    Sentry.init({ dsn: `https://${sentry.key}@${sentry.ingestNode}.ingest.sentry.io/${sentry.project}`, });
} else {
    logger.warn('Sentry is not logging errors.');
}

// Create sequelize instance
let sequelize = new Sequelize(database);
(async function dbConnect(withError) {
    logger.info('Connecting to database..');

    try {
        sequelize = new Sequelize(database);
        await sequelize.authenticate();
        if (withError) client.sequelize = sequelize; // Update instance
        logger.info('Database connection has been established successfully.');
        return sequelize;
    } catch (error) {
        logger.error(`Unable to connect to the database (will retry): ${error}`);
        setTimeout(() => dbConnect(true), 1500);
    }
}());

// We've successfully reached our bot core code.
logger.info(`${discord.name} starting up!`);

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
            handleEdits: true,
            commandUtil: true,
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

        // Pass in sequelize
        this.sequelize = sequelize;
    }
}

const client = new Stylizer();
if (!discord.sharding.enabled) client.login(discord.token);
client.on('error', console.error);
