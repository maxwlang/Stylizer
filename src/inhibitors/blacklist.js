/* eslint-disable class-methods-use-this */
/**
 * Bot user blacklist
 */
const { Inhibitor, } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist',
        });
    }

    exec(message) {
        const blacklist = [''];
        return blacklist.includes(message.author.id);
    }
}

module.exports = BlacklistInhibitor;
