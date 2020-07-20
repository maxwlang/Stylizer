const { MessageEmbed, } = require('discord.js');
const discord = require('../config/discord');

const processEmbed = new MessageEmbed()
    .setColor(`0x${discord.embeds.loadingColor}`)
    .setAuthor(discord.name)
    .setTitle('Processing Image')
    .setDescription('I\'m processing your image, hold tight!')
    .setThumbnail('https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336')
    .setTimestamp();

module.exports = processEmbed;
