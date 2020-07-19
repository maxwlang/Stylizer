/* eslint-disable class-methods-use-this */
/**
 * Stylize Command
 * Stylizes images
 */
const { Command, } = require('discord-akairo');
const torch = require('libtorchjs');
const jpeg = require('jpeg-js');
const path = require('path');
const logger = require('../modules/winston');

// Folder path to torch models
const modelsFolder = path.join(
    path.dirname(__dirname),
    'modules',
    'neural-style',
    'models',
);

logger.debug(`Models folder: ${modelsFolder}`);

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

        // Build our processing embed.
        const processEmbed = message.client.util.embed()
            .setColor(0xFFAC33)
            .setAuthor(message.client.user.username)
            .setTitle('Supported Styles')
            .addField('Description', 'A list of styles the bot currently supports. Width and Height are recommendations.')
            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            .setTimestamp();

        // Build our upload embed.
        const uploadEmbed = message.client.util.embed()
            .setColor(0xFFAC33)
            .setAuthor(message.client.user.username)
            .setTitle('Supported Styles')
            .addField('Description', 'A list of styles the bot currently supports. Width and Height are recommendations.')
            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            .setTimestamp();


        const msg = await message.reply('test');
        // msg.edit('test23213');
        // Pretty clean and straight forward:
        // Get our image, convert, apply, convert, upload.
        // downloadImage((hasURL ? args.url : ''))
        //     .then(buffer => bufferToTensor(buffer))
        //     .then(tensor => applyStyle(tensor, style))
        //     .then(tensor => tensorToBuffer(tensor))
        //     .then(buffer => bufferToPNG(buffer))
        //     .then(png => {
        //         // Upload with embed
        //     })
        //     .catch(logger.error);

        return message.reply('Pong!');
    }
}

module.exports = Stylize;

function jpegToTensor(jpegData) {
    const img = jpeg.decode(jpegData);
    const arr = new Float32Array(img.width * img.height * 3);
    const channelSize = img.width * img.height;

    // convert from (width,height,rgba) to (rgb,width,height)
    for (let i = 0; i < channelSize; i++) {
        arr[i] = img.data[i * 4];
        arr[i + channelSize] = img.data[i * 4 + 1];
        arr[i + channelSize * 2] = img.data[i * 4 + 2];
    }
    // initial tensor is flat
    const tensor = torch.tensor(arr);
    // reshape to 1x3xWxH to match model input
    return tensor.view([1, 3, img.width, img.height]);
}

function tensorToJpeg(tensor, width, height, quality = 90) {
    const arr = tensor.toUint8Array();
    const img = Buffer.alloc(width * height * 4);
    const channelSize = width * height;

    // convert from (rgb, width, height) to (width, height, rgba)
    for (let i = 0; i < channelSize; i++) {
        img[i * 4] = arr[i]; // red
        img[i * 4 + 1] = arr[i + channelSize]; // green
        img[i * 4 + 2] = arr[i + channelSize * 2]; // blue
        img[i * 4 + 3] = 0xFF; // alpha - ignored
    }
    const rawImageData = {
        data: img,
        width: width,
        height: height,
    };
    const jpegImageData = jpeg.encode(rawImageData, quality);
    return jpegImageData.data;
}

function applyStyle(img, modelFile, width, height, cb) {
    const input = jpegToTensor(img);
    torch.load(modelFile, function (err, model) {
        if (err) return cb(err);
        // pass the image data to model
        model.forward(input, function (err, result) {
            if (err) return cb(err);
            // convert to jpeg and return
            const jpg = tensorToJpeg(result, width, height);
            cb(null, jpg);
        });
    });
}

function dataUriToBuffer(dataURI) {
    return Buffer.from(dataURI.split(',', 2)[1], 'base64');
}

function bufferToDataUri(buffer, mediaType) {
    return 'data:' + mediaType + ';base64,' + buffer.toString('base64');
}
