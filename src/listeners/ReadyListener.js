/* eslint-disable class-methods-use-this */
const { Listener, } = require('discord-akairo');
const logger = require('../modules/winston');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
        });
    }

    exec() {
        logger.info('Logged in.');
    }
}

module.exports = ReadyListener;
