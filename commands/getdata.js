module.exports = {
    name: 'getdata',
    description: 'Getting data from the DB',
    
    execute(message, db, userquery, userid, uname){
        if (!message.mentions.users.size) {
            getUserData({caca});
        } else{
            const taggedUser = message.mentions.users.first();
            userid = taggedUser.id;
            uname = taggedUser.username;
            getUserData(db, userquery, userid, uname);
        }
    }
}

function getUserData(db, userquery, userid, uname){
    db.get(userquery, [userid], (err, row) => {

        if (err) {
            console.log(err);
            return;
        }
        if(row == undefined){

            undefinedUserDATA(db, userid, uname, row);

        }else{sendUserDATA(userid, uname, row);}
    });
}

function undefinedUserDATA(db, userid, uname){
        let insertdata = db.prepare(`INSERT INTO user VALUES(?,?,?)`);
        insertdata.run(userid, uname, 1);
        insertdata.finalize();
        db.close();
        console.log('---Added new user---')
        console.log(`${userid} - ${uname} - 1`);
}

function sendUserDATA(userid, uname, row){
    console.log(`${userid} - ${uname} - ${row.total}`);
}

