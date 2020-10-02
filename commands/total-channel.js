const { redBright } = require('chalk');
const { MessageEmbed } = require('discord.js');
const embed = new MessageEmbed();

const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'total-channel',
    description: 'Sum of all messages',
    execute(message){
        const channelId = message.channel.id;
        const serverId = message.guild.id;
        console.log(serverId);
        const dab = new sqlite.Database('./datos.db', sqlite.OPEN_READONLY);

        const channelQuery = `SELECT *
        FROM Channels_${serverId}
        WHERE ChannelId = ?`

        makeUserListSend(dab, serverId);
        makeChannelListSend(dab, message, channelQuery, channelId, embed)
    }
}

function makeUserListSend(dab, serverId){
    dab.all(`SELECT * FROM Channels_${serverId}`, function(err, rows) {
        if(err) {
            console.log(redBright('ERROR : total-channel query function') + err);
            return;
        }
        const channelList = [];
        try {
            rows.forEach(function (row) {
            channelList.push(`${row.ChannelId} - ${row.ChannelName} - ${row.TotalChannel}`);
            })
        } catch (error) {
            console.log(error);
        }
        console.log(channelList);
    });
}

function makeChannelListSend(dab, message, channelQuery, channelId, embed){
    dab.get(channelQuery, [channelId], (err, row) => {
        if(err) {
            console.log(redBright('ERROR : getUserDataQuery[2] function -- ') + err);
            return;
        }
        const channelList = [];
        try {
            channelList.push(`${message.channel.name} - ${row.ChannelName} - ${row.TotalChannel}`);
        } catch (error) {
            console.log(redBright('ERROR : total-channel pushing new elements on a list -- ') + error);
        }
        sendEmbedChannel(message, embed, row);
    });
}

function sendEmbedChannel(message, embed, row){
    embed.setAuthor('My Bot', 'https://i.pinimg.com/564x/9a/14/b8/9a14b8b2c9494052fab98e31e76bb929.jpg')
    embed.addField('Channel Name', message.channel.name, true)
    embed.addField('Total Messages', row.TotalChannel, true)
    embed.setTimestamp();
    message.channel.send(embed);
}