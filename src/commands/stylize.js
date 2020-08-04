/* eslint-disable class-methods-use-this */
/**
 * Stylize Command
 * Stylizes images
 */

const { Command, } = require('discord-akairo');
const fileType = require('file-type');
const fetch = require('node-fetch');
const logger = require('../modules/winston');


const {
    processEmbed,
    // errorEmbed,
} = require('../embeds');

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
            args: [
                {
                    id: 'style',
                    otherwise: 'Please specify a style as the first argument. View a list with the \`styles\` command.',
                    prompt: {
                        retries: 1,
                        time: 30000,
                        optional: false,
                    },
                },
                {
                    id: 'url',
                    promopt: {
                        optional: true,
                    },
                },
            ],
        });
    }

    // We out here
    async exec(message, args) {
        logger.debug(`Stylize arguments: ${JSON.stringify(args, null, 2)}`);

        // If we have a URL specified we need to swap out the downloaded content later on.
        let hasURL = false;
        if (args.url !== null) hasURL = true;


        // Send processing embed, update later.
        const msg = await message.reply(processEmbed);
        logger.debug(`Attachment: ${JSON.stringify(message.attachments.first(), null, 2)}`);

        // Watch for when user sends both a URL and message with upload.
        if (typeof message.attachments.first() !== 'undefined' && hasURL) return msg.edit('You\'ve provided a URL and uploaded an image, please choose one and try again.');

        // TODO: If neither scan messages above for next image. (regex filename for extension, verify later)

        // Pretty clean and straight forward:
        // Get our image, convert, apply, convert, upload.
        // We use buffers so we don't have to store images locally! :)
        return message.reply('test');
        //     // Upload with embed
        //     msg.edit(uploadEmbed);
        // })
        // .catch(e => {
        //     console.log('broke:', e);
        //     logger.error(e);
        //     msg.edit(errorEmbed);
        // });
    }
}

module.exports = Stylize;

/**
 * Downloads an image from a URL and returns it in a buffer, has a mime type whitelist.
 * @param {String} url - An image URL we download content from.
 * @returns {Buffer} - Image content buffer.
 */
async function downloadImage(url) {
    logger.debug(`Will download from: ${url}`);

    const res = await fetch(url);
    const buffer = await res.buffer();
    const type = await fileType.fromBuffer(buffer);
    logger.debug(`Filetype: ${JSON.stringify(type, null, 2)}`);

    // Throw an error if we don't have an image filetype we recognize.
    if ([
        'image/png',
        'image/jpg',
        'image/jpeg',
    ].indexOf(type.mime) === -1) throw new Error('Unsupported filetype.');

    return buffer;
}
