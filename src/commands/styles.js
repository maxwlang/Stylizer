/* eslint-disable class-methods-use-this */
/**
 * Styles Command
 * Shows list of availible models
 */
const { Command, } = require('discord-akairo');

class Styles extends Command {
    constructor() {
        super('styles', {
            aliases: [
                'styles',
                'list',
                'l',
            ],
        });
    }

    exec(message) {
        return message.reply('Pong!');
    }
}

module.exports = Styles;
