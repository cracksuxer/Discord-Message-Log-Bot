const { redBright, blueBright } = require('chalk');

const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'total-user',
    description: 'Sum of all messages',
    execute(message){
        const serverId = message.guild.id;
        let total = 0;
        const dab = new sqlite.Database('./datos.db', sqlite.OPEN_READONLY);
        dab.all(`SELECT TotalUser FROM Users_${serverId}`, function(err, rows) {
            if(err) {
                console.log(redBright("ERROR"));
                return;
            }
            const userList = [];
            rows.forEach(function (row) {
                userList.push(row.TotalUser);
                total += row.TotalUser;
            })
            console.log(userList);
            console.log(blueBright('Mensajes totales : ') + total);
            message.channel.send('Mensajes totales ' + total);
        });
    }
}