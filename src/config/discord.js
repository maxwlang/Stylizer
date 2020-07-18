const discord = {
    token: process.env.STYLIZER_TOKEN || 'NzMzOTI5MDU0OTMxMjU1MzI3.XxKSwg.JixPsI-d7u7QuF88FrTbHwGo--M',

    sharding: {
        enabled: false,
        maxShards: 2,
    },
};

if (discord.sharding.enabled && discord.sharding.maxShards < 2) discord.sharding.enabled = false;

module.exports = discord;
