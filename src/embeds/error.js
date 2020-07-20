const { MessageEmbed, } = require('discord.js');
const discord = require('../config/discord');

const processEmbed = new MessageEmbed()
    .setColor(`0x${discord.embeds.dangerColor}`)
    .setAuthor(discord.name)
    .setTitle('An error has occured')
    .setDescription('An error has occured. This incedent has been logged.')
    // .setThumbnail('https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336')
    .setTimestamp();

module.exports = processEmbed;
