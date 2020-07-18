/* eslint-disable class-methods-use-this */
/**
 * Stylize Command
 * Stylizes images
 */
const { Command, } = require('discord-akairo');

class Stylize extends Command {
    constructor() {
        super('stylize', {
            aliases: [
                'stylize',
                'style',
                's',
            ],
            cooldown: 5000,
            description: 'Stylizes images with a pre-rendered model template',

        });
    }

    exec(message) {
        return message.reply('Pong!');
    }
}

module.exports = Stylize;
