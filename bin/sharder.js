// Node modules
const Sentry = require('@sentry/node');
const { ShardingManager, } = require('discord.js');

// Vital local resources
const {
    discord,
    sentry,
} = require('../src/config');
const logger = require('../src/modules/winston');

logger.info(`${discord.name} is preparing to spawn shards..`);

// Initialize Sentry error handler if enabled
if (sentry.enabled) {
    Sentry.init({ dsn: `https://${sentry.key}@${sentry.ingestNode}.ingest.sentry.io/${sentry.project}`, });
} else {
    console.warn('Sentry is not logging errors in the sharder.');
}

// Create ShardingManger instance
const manager = new ShardingManager('./bin/bot.js', {
    totalShards: discord.sharding.maxShards,
    token: discord.token,
});

// Spawn shards
manager.spawn();

// Handle sharder events
manager.on('shardCreate', shard => logger.info(`Shard ${shard.id} launched`));
manager.on('shardDestroy', shard => logger.warn(`Shard ${shard.id} destroyed`));
