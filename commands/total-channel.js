const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'total-channel',
    description: 'Sum of all messages',
    execute(message){
        const serverId = message.guild.id;
        console.log(serverId);
        const dab = new sqlite.Database('./datos.db', sqlite.OPEN_READONLY);
        dab.all(`SELECT * FROM Channels_${serverId}`, function(err, rows) {
            if(err) {
                console.log("Error");
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
}

