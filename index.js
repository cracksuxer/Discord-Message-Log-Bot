'use strict';
const Discord = require('discord.js');
const { prefix, BOT_TOKEN } = require("./config.json");
const client = new Discord.Client();
const sqlite = require("sqlite3").verbose();
const {CanvasRenderService} = require('chartjs-node-canvas');
const fs = require('fs');
const { connect } = require('http2');
const { off } = require('process');
const { emitKeypressEvents } = require('readline');
const _ = require('lodash');
const { compact } = require('lodash');
 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

let array = [0];

client.on(`ready`, () => {

    console.log("Online");
    client.user.setActivity("Tu madre");

    let db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('Conectado a datos.db');
    });

    db.run(`CREATE TABLE IF NOT EXISTS user(ChannelId TEXT NOT NULL, UserId TEXT NOT NULL, Username TEXT NOT NULL, Total INTEGER NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS channel(ServerId TEXT NOT NULL, ChannelId TEXT NOT NULL, ChannelName TEXT NOT NULL, Total INTEGER NOT NULL)`)
    db.run(`CREATE TABLE IF NOT EXISTS server(ServerId TEXT, ServerName TEXT)`)

    addingServerId(db);
});

client.on(`message`, (message) => {

    if (message.author.bot) return;

    const db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE);
    let userquery = `SELECT * FROM user WHERE userid = ?`;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    let userid = message.author.id;
    let uname = message.author.tag;
    let isAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR", true);

    if(command == 'end'){
        if(isAdmin == false) return;
        if (array.slice(-1) == 0) {
            console.log('The bot is already stopped')
            message.channel.send('The bot is already stopped')
        } else {
            array.pop();
            console.log(`Pop array () ; Array = ${array}`)
            message.channel.send(`Pop array () ; Array = ${array}`)
        }
    } 
    if(command == 'start'){
        if(isAdmin == false) return;
        if(array.slice(-1) == 1){
            console.log('The bot is already logging messages');
            message.channel.send('The bot is already logging messages')
        } else {
            array.push(1);
            console.log(`Pushed array (1) ; Array = ${array}`)
            message.channel.send(`Pushed array (1) ; Array = ${array}`)
        }
    }

    if(array.slice(-1) == 1){
        console.log(`Logging messages because -> New array: ${array.slice(-1)} = 1`)
        message.channel.send(`Logging messages because -> New array: ${array.slice(-1)} = 1`)
        client.commands.get('start').execute(message, db, userquery);
    } else {
        console.log(`Cant log messages because -> New array: ${array.slice(-1)} != 1`)
        message.channel.send(`Cant log messages because -> New array: ${array.slice(-1)} != 1`)
    }

    try {
        if (!client.commands.has(command) || command == ('start' || 'end')) return;
        client.commands.get(command).execute(message, db, userquery, userid, uname);
    } catch (error){
        console.error(error);
        message.reply(`There was an error trying to execute ${command}. . .`)
    } 


});


function addingServerId(db) {

    const serverIdList = [];
    let serverquery = `SELECT ServerId FROM server`;

    client.guilds.cache.forEach(server => {
        serverIdList.push(server.id)
    })

    db.all(serverquery, [], function(err, rows) {

        if(err){
            console.log(err);
        }
        
        serverIdList.forEach(serverId =>{
            let checker = 0;
            rows.forEach(function (rows) {
                if(rows.ServerId == serverId){
                    checker ++;
                }
            })
            if(checker == 0){
                let serverName = client.guilds.cache.get(serverId).name;
                let insertdata = db.prepare(`INSERT INTO server VALUES(?,?)`)
                insertdata.run(serverId, serverName);
                insertdata.finalize();
                console.log('---Added new server---');
            }
        })
    });
}

client.login(BOT_TOKEN); 


/*if (rows === undefined) {
            serverIdList.forEach(server => {
                let insertdata = db.prepare(`INSERT INTO server VALUES(?,?)`);
                insertdata.run(serverIdList[i], serverNameList[i]);
                i++;
                insertdata.finalize();
            })
            console.log('Added new data to server table. REASON: No data inside')
            return;
        } else {
            serverIdList.forEach(serverId =>{
                rows.forEach(function (rows) {
                    console.log(rows, rows.ServerId, serverId)
                    if (rows.ServerId == serverId) return;
                    else{
                        let insertdata = db.prepare(`INSERT INTO server(serverId) VALUES(?)`)
                        insertdata.run(serverId);
                        insertdata.finalize();
                        console.log('---Added new server---');
                    }
                })
            })
        }
    }); */





/*function getGuildUsers(message){
    client.guilds.cache.forEach(guild => {
        let randomList = [];
        let dndList = [];
        let idleList = [];
        let botList = [];
        let offlineList = [];
        let totalOnline = 0;
        message.channel.send(`\n\n---Guild with id : ${guild.name} members---\n\n`)
        guild.members.cache.forEach(element => {
            if(element.user.bot == false){
                if(element.user.presence.status == 'online'){
                    randomList.push(`${element.user.username} with status is online`);
                    totalOnline++;
                } else if (element.user.presence.status == 'offline'){
                    offlineList.push(`${element.user.username} with status is offline`)
                } else if(element.user.presence.status == 'idle'){
                    idleList.push(`${element.user.username} is afk`);
                } else if(element.user.presence.status == 'dnd'){
                    dndList.push(`${element.user.username} is in do not disturb`);
                }
            }else{
                botList.push(`The bot ${element.user.username} with status is online/offline`)
            }
        });

        if(!randomList.length){
            message.channel.send('No online users')
            console.log(`Cannot send an empty array : randomList`)
        } else {
            message.channel.send('---Online users---');
            message.channel.send(randomList);
        }
        if(!dndList.length){
            message.channel.send('No dnd users')
            console.log(`Cannot send an empty array : dndList`)
        } else {
            message.channel.send('---DnD users---');
            message.channel.send(dndList);
        }
        if(!idleList.length){
            message.channel.send('No afk users')
            console.log(`Cannot send an empty array : idleList`)
        } else {
            message.channel.send('---AFK users---');
            message.channel.send(idleList);
        }
        if(!offlineList.length){
            message.channel.send('No offline users')
            console.log(`Cannot send an empty array : offlineList`)
        } else {
            message.channel.send('---Offline users---');
            message.channel.send(offlineList)
        }
        if(!botList.length){
            message.channel.send('No bot users')
            console.log(`Cannot send an empty array : botList`)
        } else {
            message.channel.send('---Bots in the server---');
            message.channel.send(botList);
        }
        message.channel.send(`Total players online : ${totalOnline}`);
    })
}*/





/*    if (message.author.bot) return;

    const db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE);
    let userquery = `SELECT * FROM user WHERE userid = ?`;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    let userid = message.author.id;
    let uname = message.author.tag;

    if (!message.content.startsWith(prefix) || message.author.bot || !client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, db, userquery, userid, uname);
    } catch (error){
        console.error(error);
        message.reply(`There was an error trying to execute ${command}. . .`)
    } 
*/










/*const http = require('http');
const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});

app.use(express.static('public'));

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
 */


























/*
client.on('ready', () =>{
    console.log('Listo bro');            //Mensaje de inicio en el log
    client.user.setActivity("Tu madre"); //A que esta jugando
    const list = client.guilds.cache.get("733465575275364352");
    list.members.cache.forEach(member => console.log(member.user.username));
});

client.on('message', (message) => {

    function barrita(totalMessages, steps, init){

        while(init != totalMessages){
            message.channel.send('▆');
            init += steps;
        }
    
    }
    
    switch(message.content){
        case 'ping':
            message.channel.send('pong');
            break;
        case 'cono':
            let memberCount = list.memberCount;                          
            message.channel.send(`Hay ${memberCount} personas`);  
            break;
        case 'user':
            let status = message.author.presence.status;
            let bot = message.author.bot;
            let last = message.channel.lastMessage.content;
            message.channel.send(`Is ${status} with last message: ${last}`);
            if(bot = 0){
                message.channel.send('Es un bot');
            } else {message.channel.send('No es un bot')}
            break;
        case 'caca':
            const list = client.guilds.cache.get("733465575275364352");
            list.members.cache.forEach(member => message.channel.send(`${member.user.id} - ${member.user.username} - ${member.user.presence.status}`));
            break;
        case 'pan':
            barrita(2000, 20, 0);
            break;
        case 'ola':
            message.channel.send(message.member.user.lastMessage);
            break;
        default:
            console.log('Error en el switch') 
        }

}); 


function totalUpdate (database, query, userid){
    database.get(query, [userid], (err, row) => {

        if (err) {
            console.log(err);
            return;
        }
    let count = row.total;
    count++;
    database.run(`UPDATE data SET total = ? WHERE userid = ?`, [count, userid]);
    console.log("Updated");
    sleep(2000);
    totalUpdate(database, query, userid);
    });
}
*/