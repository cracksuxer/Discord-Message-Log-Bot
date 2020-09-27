module.exports = {
    name: 'start',
    description: 'Starting logging messages',
    execute(message, db, userquery){
            
        let channelquery = `SELECT * FROM channel WHERE channelid = ?`
    
        if (message.author.bot) return;

        const userid = message.author.id;
        const uname = message.author.tag;
        const channelid = message.channel.id;
        const channelname = message.channel.name;

        db.get(userquery, [userid], (err, row) => {

            if (err) {
                console.log(err);
                return;
            }
            if (row === undefined) {
                let insertdataUser = db.prepare(`INSERT INTO user VALUES(?,?,?)`);
                insertdataUser.run(userid, uname, 0);
                insertdataUser.finalize();
                console.log('---Added new user---')
                console.log(`${userid} - ${uname} - 1`);
                message.channel.send('---Added new user---')
                message.channel.send(`${userid} - ${uname} - 1`);
                return;
            } else {
                let usercount = row.total;
                usercount++;
                db.run(`UPDATE user SET total = ? WHERE userid = ?`, [usercount, userid]);
                console.log(`Updated ${uname} with ${usercount} messages`);
                message.channel.send(`Updated ${uname} with ${usercount} messages`);
                return;
            }
        });

        db.get(channelquery, [channelid], (err, row) => {

            if (err) {
                console.log(err);
                return;
            }
            if (row === undefined) {
                let insertdatachannel = db.prepare(`INSERT INTO channel VALUES(?,?,?)`);
                insertdatachannel.run(channelid, channelname, 1);
                insertdatachannel.finalize();
                console.log('---Added new channel---')
                message.channel.send('---Added new channel---');
                console.log(`${channelid} - ${channelname} - 1`);
                message.channel.send(`${channelid} - ${channelname} - 1`);
                return;
            } else {
                let channelcount = row.total;
                channelcount++;
                db.run(`UPDATE channel SET total = ? WHERE channelid = ?`, [channelcount, channelid]);
                console.log(`Updated ChannelId: ${channelid} with ${channelcount} messages`);
                message.channel.send(`Updated ChannelId: ${channelid} with ${channelcount} messages`);
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