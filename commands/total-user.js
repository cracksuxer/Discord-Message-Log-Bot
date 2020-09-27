const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'total-user',
    description: 'Sum of all messages',
    execute(message){
        let totalx = 0;
        const dab = new sqlite.Database('./datos.db', sqlite.OPEN_READONLY);
        dab.all("SELECT total FROM user", function(err, rows) {
            if(err) {
                console.log("Error");
                return;
            }
            const userList = [];
            rows.forEach(function (row) {
                userList.push(row.total);
                totalx = totalx + row.total;
            })
            console.log(userList);
            console.log(totalx);
            message.channel.send('Mensajes totales ' + totalx);
        });
    }
}