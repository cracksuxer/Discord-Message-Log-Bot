const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'start',
    description: 'Starting logging messages',
    execute(message){

        let db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE);
        const channelquery = `SELECT * FROM channel WHERE channelid = ?`
        const userquery = `SELECT * FROM user WHERE userid = ?`;
    
        if (message.author.bot) return;

        const userId = message.author.id;
        const uname = message.author.tag;
        const channelId = message.channel.id;
        const channelName = message.channel.name;
        const serverId = message.guild.id;


        db.get(userquery, [userId], (err, row) => {

            if (err) {
                console.log(err);
                return;
            }
            if (row === undefined) {
                let insertdataUser = db.prepare(`INSERT INTO user VALUES(?,?,?,?)`);
                insertdataUser.run(serverId, userId, uname, 1);
                insertdataUser.finalize();
                console.log('---Added new user---')
                console.log(`${userId} - ${uname} - 1`);
                message.channel.send('---Added new user---')
                message.channel.send(`${userId} - ${uname} - 1`);
                return;
            } else {
                let userCount = row.TotalUser;
                userCount++;
                db.run(`UPDATE user SET totaluser = ? WHERE userid = ?`, [userCount, userId]);
                console.log(`Updated ${uname} with ${userCount} messages`);
                message.channel.send(`Updated ${uname} with ${userCount} messages`);
                return;
            }
        });

        db.get(channelquery, [channelId], (err, row) => {

            if (err) {
                console.log(err);
                return;
            }
            if (row === undefined) {
                let insertdatachannel = db.prepare(`INSERT INTO channel VALUES(?,?,?,?)`);
                insertdatachannel.run(serverId, channelId, channelName, 1);
                insertdatachannel.finalize();
                console.log('---Added new channel---')
                message.channel.send('---Added new channel---');
                console.log(`${channelId} - ${channelName} - 1`);
                message.channel.send(`${channelId} - ${channelName} - 1`);
                return;
            } else {
                let channelCount = row.TotalChannel;
                channelCount++;
                db.run(`UPDATE channel SET totalchannel = ? WHERE channelid = ?`, [channelCount, channelId]);
                console.log(`Updated ChannelId: ${channelId} with ${channelCount} messages`);
                message.channel.send(`Updated ChannelId: ${channelId} with ${channelCount} messages`);
                return;
            }
        }); 
    }
}








/*          db.get(userquery, [userid], (err, row) => {
    
                if (err) {
                    console.log(err);
                    return;
                }
                if (row === undefined) {
                    let insertdataUser = db.prepare(`INSERT INTO user VALUES(?,?,?)`);
                    insertdataUser.run(userid, uname, 0);
                    insertdataUser.finalize();
                    console.log('---Added new user---')
                    console.log(`${userid} - ${uname} - 0`);
                    return;
                } else {
                    let usercount = row.total;
                    usercount++;
                    db.run(`UPDATE user SET total = ? WHERE userid = ?`, [usercount, userid]);
                    console.log(`Updated ${uname}`);
                    return;
                }
            }); */