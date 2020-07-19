/* eslint-disable class-methods-use-this */
/**
 * Custom Stylize Command
 * Stylizes images without pre-rendered models, takes gpu time.
 */
const { Command, } = require('discord-akairo');

class CStylize extends Command {
    constructor() {
        super('cstylize', {
            aliases: [
                'cstylize',
                'cstyle',
                'cs',
            ],
            cooldown: 60000, // 1 Minute
            description: 'Stylizes images without a pre-rendered model template, takes GPU time.',
            // lock:
            // locker:
        });
    }

    exec(message) {
        return message.reply('Pong!');
    }
}

module.exports = CStylize;
