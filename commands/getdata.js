const sqlite = require('sqlite3').verbose();
const { redBright } = require('chalk');
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'getdata',
    description: 'Getting data from the DB',
    
    execute(message){
        const db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE);
        const serverId = message.guild.id;
        let userId = message.author.id;
        if (!message.mentions.users.size) {
            getUserData(db, userId, serverId, message);
        } else{
            const taggedUser = message.mentions.users.first();
            userId = taggedUser.id;
            getUserData(db, userId, serverId);
        }
    }
}

function getUserData(db, userId, serverId, message){

    const getUserQuery = `
    SELECT a.ServerId, a.ServerName, b.UserId, b.Username, b.TotalUser
    FROM server a 
    INNER JOIN Users_${serverId} b
    ON a.ServerId = b.ServerId
    WHERE a.ServerId = ?
    AND b.userId = ?`;

    db.get(getUserQuery, [serverId, userId], function(err, rows){

        if (err) {
            console.log(redBright('ERROR : getUserDataQuery function') + err);
            return;
        }

        if(rows == undefined){
            undefinedUserDATA()
        } else {
            sendUserDATA(rows, message);
        }
    });
}

function undefinedUserDATA(){
    console.log('This member has not sent any message in this guild');
    return;
}

function sendUserDATA(rows, message){
    console.log(`
    ServerId:    ${rows.ServerId}, 
    ServerName:  ${rows.ServerName}, 
    UserId:      ${rows.UserId}, 
    Username:    ${rows.Username}, 
    TotalUser:   ${rows.TotalUser}
`);
    const embed = new MessageEmbed();
        embed.setTitle('User Info')
        embed.setThumbnail(message.author.displayAvatarURL())
        embed.setColor(0x172e80)
        embed.setDescription(`
            **ServerId:**\t${rows.ServerId}
            **ServerName:**\t${rows.ServerName}
            **UserId:**\t${rows.UserId}
            **Username:**\t${rows.Username}
            **TotalUser:**\t${rows.TotalUser}
        `)
    message.channel.send(embed);
}

