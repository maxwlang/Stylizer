// Vital local resources
const { discord, } = require('./src/config');
const logger = require('./src/modules/winston');

logger.info(`${discord.name} is determining correct binary for startup..`);

if (discord.sharding.enabled) {
    logger.info('Launching in sharded mode..');
    require('./bin/sharder');
} else {
    logger.info('Launching in single process..');
    require('./bin/bot');
}
