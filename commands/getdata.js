const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'getdata',
    description: 'Getting data from the DB',
    
    execute(message){
        const db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE);
        const serverId = message.guild.id;
        let userId = message.author.id;
        if (!message.mentions.users.size) {
            getUserData(db, userId, serverId);
        } else{
            const taggedUser = message.mentions.users.first();
            userId = taggedUser.id;
            getUserData(db, userId, serverId);
        }
    }
}

function getUserData(db, userId, serverId){

    const queryTest = `
    SELECT a.ServerId, a.ServerName, b.UserId, b.Username, b.TotalUser
    FROM server a 
    INNER JOIN Users_${serverId} b
    ON a.ServerId = b.ServerId
    WHERE a.ServerId = ?
    AND b.userId = ?`;

    db.get(queryTest, [serverId, userId], function(err, rows){

        if (err) {
            console.log(`There has been an error in getUserData function : ${err}`);
            return;
        }

        if(rows == undefined){
            undefinedUserDATA()
        } else {
            sendUserDATA(rows);
        }
    });
}

function undefinedUserDATA(){
    console.log('This member has not sent any message in this guild');
    return;
}

function sendUserDATA(rows){
    console.log(`
    ServerId:    ${rows.ServerId}, 
    ServerName:  ${rows.ServerName}, 
    UserId:      ${rows.UserId}, 
    Username:    ${rows.Username}, 
    TotalUser:   ${rows.TotalUser}
`);
}

