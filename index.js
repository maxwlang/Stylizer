// Vital local resources
const { discord, } = require('./src/config');
const logger = require('./src/modules/winston');

logger.info('Stylizer is determining correct binary for startup..');

if (discord.sharding.enabled && discord.sharding.maxShards > 1) {
    logger.info('Launching in sharded mode..');
    require('./bin/sharder');
} else {
    logger.info('Launching in single process..');
    require('./bin/bot');
}
