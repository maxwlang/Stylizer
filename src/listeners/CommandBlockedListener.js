/* eslint-disable class-methods-use-this */
const { Listener, } = require('discord-akairo');
const logger = require('../modules/winston');

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked',
        });
    }

    exec(message, command, reason) {
        logger.info(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`);
    }
}

module.exports = CommandBlockedListener;
