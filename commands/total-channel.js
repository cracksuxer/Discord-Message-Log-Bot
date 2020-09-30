const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'total-channel',
    description: 'Sum of all messages',
    execute(){
        const dab = new sqlite.Database('./datos.db', sqlite.OPEN_READONLY);
        dab.all("SELECT * FROM channel", function(err, rows) {
            if(err) {
                console.log("Error");
                return;
            }
            const channelList = [];
            try {
                rows.forEach(function (row) {
                channelList.push(`${row.channelid} - ${row.channelname} - ${row.total}`);
                })
            } catch (error) {
                console.log(error);
            }
            console.log(channelList);
        });
    }
}

