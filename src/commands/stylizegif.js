/* eslint-disable class-methods-use-this */
const { Command, } = require('discord-akairo');

class StylizeGif extends Command {
    constructor() {
        super('stylizegif', {
            aliases: [
                'stylizegif',
                'stylegif',
                'sgif',
            ],
        });
    }

    exec(message) {
        return message.reply('Pong!');
    }
}

module.exports = StylizeGif;
