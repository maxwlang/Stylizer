/* eslint-disable class-methods-use-this */
/**
 * Stylize Command
 * Stylizes images
 */

const tf = require('@tensorflow/tfjs-node');
const { Command, } = require('discord-akairo');
const fileType = require('file-type');
const fetch = require('node-fetch');
const path = require('path');
const logger = require('../modules/winston');


const {
    processEmbed,
    errorEmbed,
} = require('../embeds');

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

        // Build our upload embed.
        const uploadEmbed = message.client.util.embed()
            .setColor(0xFFAC33)
            .setAuthor(message.client.user.username)
            .setTitle('Style Result')
            .addField('Description', 'A list of styles the bot currently supports. Width and Height are recommendations.')
            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '\u200b', true)
            .setTimestamp();


        // Send processing embed, update later.
        const msg = await message.reply(processEmbed);
        logger.debug(`Attachment: ${JSON.stringify(message.attachments.first(), null, 2)}`);

        // Watch for when user sends both a URL and message with upload.
        if (typeof message.attachments.first() !== 'undefined' && hasURL) return msg.edit('You\'ve provided a URL and uploaded an image, please choose one and try again.');

        // TODO: If neither scan messages above for next image. (regex filename for extension, verify later)

        // Pretty clean and straight forward:
        // Get our image, convert, apply, convert, upload.
        // We use buffers so we don't have to store images locally! :)
        return downloadImage((hasURL ? args.url : await message.attachments.first().url)) // url provided or upload url
            .then(buffer => bufferToTensor(buffer))
            .then(tensor => applyStyle(tensor, args.style))
            .then(tensor => tensorToPNG(tensor))
            .then(png => {
                console.log('pnggg', png);

                // Upload with embed
                msg.edit(uploadEmbed);
            })
            .catch(e => {
                console.log('broke:', e);
                logger.error(e);
                msg.edit(errorEmbed);
            });
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

/**
 * Convert image to tensor
 * @param {Buffer} buffer - Image buffer to be converted
 * @returns {Any} - Tensor
 */
async function bufferToTensor(buffer) {
    const tensor = tf.node.decodeImage(buffer);
    logger.debug(`Tensor: ${JSON.stringify(tensor, null, 2)}`);
    return tensor;
}


/**
 * Applies styles to images.
 * @param {Any} contentTensor - Content image tensor
 * @param {Any} styleTensor - Style image tensor
 * @returns {Any} - Stylized tensor
 */
async function applyStyle(contentTensor, styleTensor) {

    const styleInceptionModelPath = path.join(modelsFolder, 'style_inception_js', 'model.json');
    logger.debug(`Loading model 1/2: ${styleInceptionModelPath}`);
    const styleInceptionModel = await tf.node.loadSavedModel(styleInceptionModelPath);

    const transformerModelPath = path.join(modelsFolder, 'transformer_js', 'model.json');
    logger.debug(`Loading model 2/2: ${transformerModelPath}`);
    const transformerModel = await tf.node.loadSavedModel(transformerModelPath);
    logger.debug('OK');

    await tf.nextFrame();
    logger.debug('Generating 100D style representation of image 1');

    await tf.nextFrame();
    const prediction1 = await tf.tidy(() => styleInceptionModel.predict(
        // tf.browser.fromPixels(this.combStyleImg1).toFloat().div(tf.scalar(255)).expandDims()
        styleTensor.toFloat().div(tf.scalar(255)).expandDims() // May be content tensor?
    ));

    logger.debug('Generating 100D style representation of image 2');
    await tf.nextFrame();

    const prediction2 = await tf.tidy(() => styleInceptionModel.predict(
        // tf.browser.fromPixels(this.combStyleImg2).toFloat().div(tf.scalar(255)).expandDims()
        styleTensor.toFloat().div(tf.scalar(255)).expandDims()
    ));

    logger.debug('Stylizing image...');
    await tf.nextFrame();

    const combinedPrediction = await tf.tidy(() => {
        const combStyleRatio = 50; // TODO specify this as a command arg

        const scaledPrediction1 = prediction1.mul(tf.scalar(1 - combStyleRatio));
        const scaledPrediction2 = prediction2.mul(tf.scalar(combStyleRatio));
        return scaledPrediction1.addStrict(scaledPrediction2);
    });

    const stylized = await tf.tidy(() => transformerModel.predict(
        // [tf.browser.fromPixels(this.combContentImg).toFloat().div(tf.scalar(255)).expandDims(), combinedPrediction]
        [contentTensor.toFloat().div(tf.scalar(255)).expandDims(), combinedPrediction]
    ).squeeze());

    // await tf.browser.toPixels(stylized, this.combStylized);

    prediction1.dispose();
    prediction2.dispose();
    combinedPrediction.dispose();

    return stylized;
}

/**
 * Converts tensor back to png
 * @param {Any} tensor - Stylized tensor
 * @returns {Any} Stylized png
 */
async function tensorToPNG(tensor) {
    const combStylized = 50; // TODO: make this an arg.

    console.log('res', tensor);
    const png = await tf.node.encodePng(tensor /* , combStylized */);
    tensor.dispose();
    console.log('png', png);
    return png;
}
