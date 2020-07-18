/* eslint-disable class-methods-use-this */
/**
 * Styles Command
 * Shows list of availible models
 */
const {
    Command,
} = require('discord-akairo');

const Models = require('../models/Models');

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

    async exec(message) {
        let { sequelize, } = await message.client;

        // Add in the Model model (what..?), update local sequelize & store models model as styles.
        const gennedModel = Models(sequelize);
        const Styles = gennedModel.Models;
        sequelize = gennedModel.sequelize;

        // Find all styles
        const styles = await Styles.findAll();

        // Build embed
        const embed = message.client.util.embed()
            .setColor(0xFFAC33)
            .setAuthor(message.client.user.username)
            .setTitle('Supported Styles')
            .addField('Description', 'A list of styles the bot currently supports. Width and Height are recommendations.')
            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            .setTimestamp();

        styles.every(style => {
            if (!(style instanceof Styles)) return;

            return embed
                .addField('Name', style.name, true)
                .addField('Width', `${style.width}px`, true)
                .addField('Height', `${style.height}px`, true);
        });

        // Reply
        return message.reply(embed);
    }
}

module.exports = Styles;
