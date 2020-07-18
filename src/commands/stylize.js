/* eslint-disable class-methods-use-this */
const { Command, } = require('discord-akairo');

class Stylize extends Command {
    constructor() {
        super('stylize', {
            aliases: [
                'stylize',
                'style',
                's',
            ],
        });
    }

    exec(message) {
        return message.reply('Pong!');
    }
}

module.exports = Stylize;
