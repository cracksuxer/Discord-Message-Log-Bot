const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'start',
    description: 'Starting logging messages',
    execute(message){
        if (message.author.bot) return;
        const db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
        const serverId = message.guild.id;
        const userquery = `SELECT * FROM Users_${serverId} WHERE userid = ?`;
        const userId = message.author.id;
        const uname = message.author.tag;
        const channelquery = `SELECT * FROM Channels_${serverId} WHERE channelid = ?`
        const channelId = message.channel.id;
        const channelName = message.channel.name;

        userDb(db, userquery, userId, uname, serverId);
        channelDb(db, channelquery, channelId, channelName, serverId);
    }
}

function userDb(db, userquery, userId, uname, serverId){
    db.get(userquery, [userId], (err, row) => {

        if (err) {
            console.log(err);
            return;
        }
        if (row === undefined) {
            insertNewDataUser(db, serverId, userId, uname, serverId)
        } else {
            updateUserTotalSend(db, serverId, userId, uname, serverId, row);
        }
    });
}

function insertNewDataUser(db, serverId, userId, uname, serverId){
    let insertdataUser = db.prepare(`INSERT INTO Users_${serverId} VALUES(?,?,?,?)`);
    insertdataUser.run(serverId, userId, uname, 1);
    insertdataUser.finalize();
    console.log('---Added new user---')
    console.log(`${userId} - ${uname} - 1`);
    return;
}

function updateUserTotalSend(db, serverId, userId, uname, serverId, row){
    let userCount = row.TotalUser;
    userCount++;
    db.run(`UPDATE Users_${serverId} SET totaluser = ? WHERE userid = ?`, [userCount, userId]);
    console.log(`Updated ${uname} with ${userCount} messages`);
    return;
}

function channelDb(db, channelquery, channelId, channelName, serverId){
    db.get(channelquery, [channelId], (err, row) => {

        if (err) {
            console.log(err);
            return;
        }
        if (row === undefined) {
            insertNewDataChannel(db, serverId, channelId, channelName, serverId);
        } else {
            updateUserChannelSend(db, serverId, channelId, serverId, row);
        }
    });
}

function insertNewDataChannel(db, serverId, channelId, channelName, serverId){
    let insertdatachannel = db.prepare(`INSERT INTO Channels_${serverId} VALUES(?,?,?,?)`);
    insertdatachannel.run(serverId, channelId, channelName, 1);
    insertdatachannel.finalize();
    console.log('---Added new channel---')
    console.log(`${channelId} - ${channelName} - 1`);
    return;
}

function updateUserChannelSend(db, serverId, channelId, serverId, row){
    let channelCount = row.TotalChannel;
    channelCount++;
    db.run(`UPDATE Channels_${serverId} SET totalchannel = ? WHERE channelid = ?`, [channelCount, channelId]);
    console.log(`Updated ChannelId: ${channelId} with ${channelCount} messages`);
    return;
}