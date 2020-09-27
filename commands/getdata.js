module.exports = {
    name: 'getdata',
    description: 'Getting data from the DB',
    
    execute(message, db, userquery, userid, uname){
        if (!message.mentions.users.size) {
            getdata(db, userquery, userid, uname, message);
        } else{
            const taggedUser = message.mentions.users.first();
            userid = taggedUser.id;
            uname = taggedUser.username;
            getdata(db, userquery, userid, uname, message);
        }
    }
}

function getdata(db, userquery, userid, uname, message){
    db.get(userquery, [userid], (err, row) => {

        if (err) {
            console.log(err);
            return;
        }
        if (row === undefined) {
            let insertdata = db.prepare(`INSERT INTO user VALUES(?,?,?)`);
            insertdata.run(userid, uname, 1);
            insertdata.finalize();
            db.close();
            console.log('---Added new user---')
            console.log(`${userid} - ${uname} - 1`);
            return;
        } else {
            console.log(`${userid} - ${uname} - ${row.total}`);
            message.channel.send(`${userid} - ${uname} - ${row.total}`);
        }   
    });
}