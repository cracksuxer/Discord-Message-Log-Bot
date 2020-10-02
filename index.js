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
const chalk = require('chalk');
const { blueBright, yellowBright, greenBright, redBright } = require('chalk');
 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on(`ready`, () => {

    console.log(greenBright('Online'));
    client.user.setActivity('Tu madre');

    const db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
        if (err) {
            console.log(redBright(`ERROR at connecting to the database: ${err.message}`));
        }
        console.log(blueBright('Conectado a datos.db'));
    });

    db.run(`CREATE TABLE IF NOT EXISTS server(ServerId TEXT, ServerName TEXT)`)

    addingServerId(db);
});

const serverIdCheck = new Array();


client.on(`message`, (message) => {

    if (message.author.bot) return;

    const serverIdList = new Array();


    client.guilds.cache.forEach(server => {
        serverIdList.push(server.id);
    })


    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    const userid = message.author.id;
    const uname = message.author.tag;
    const isAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR", true);
    const msgServerId = message.guild.id;


    if(commandName == 'end'){
        if(isAdmin == false) return;
        removeElement(serverIdCheck, msgServerId)
    }

    if(commandName == 'start'){
        if(isAdmin == false) return;
        if(isElementInArray(serverIdCheck, message.guild.id) == true){
            console.log(yellowBright('The bot is already logging messages'))
            return;
        }
        serverIdCheck.push(message.guild.id);
    }

    function removeElement(array, elem) {
        const index = array.indexOf(elem);
        if (index > -1) {
            array.splice(index, 1);
        } else {console.log(yellowBright('ERROR : The bot is already stopped'))}
    }

    function isElementInArray(array, elem){
        const index = array.indexOf(elem);
        if (index > -1){return true}
        else{return false}
    }

    let isSeverOnList = 0;

    serverIdCheck.forEach(server => {
        if(server == message.guild.id){
            client.commands.get('start').execute(message);
            isSeverOnList++;
        }
    })

    if(isSeverOnList == 0){
        console.log(blueBright('The bot is stopped'))
    } else{
        console.log(greenBright('The guild is in the list'))
        console.log(greenBright(`Logging messages`))
    }
    
    try {
        if (!client.commands.has(commandName) || commandName == ('start' || 'end')) return;
        command.execute(message, client, userid, uname);
    } catch (error){
        console.error(error);
        console.log(redBright(`There was an error trying to execute ${commandName}. . .`))
        message.reply(`There was an error trying to execute ${commandName}. . .`)
    } 
});


function addingServerId(db) {

    const serverIdList = [];
    const serverquery = `SELECT ServerId FROM server`;

    client.guilds.cache.forEach(server => {
        serverIdList.push(server.id)
    })

    addingServerTables(serverIdList, db);

    db.all(serverquery, [], function(err, rows) {

        if(err){
            console.log(redBright(`ERROR`) + err);
        }
        
        serverIdList.forEach(serverId =>{
            let checker = 0;
            rows.forEach(function (rows) {
                if(rows.ServerId == serverId){
                    checker ++;
                }
            })
            if(checker == 0){
                const serverName = client.guilds.cache.get(serverId).name;
                const insertdata = db.prepare(`INSERT INTO server VALUES(?,?)`)
                insertdata.run(serverId, serverName);
                insertdata.finalize();
                console.log(blueBright('---Added new server---'));
            }
        })
    });
}

function addingServerTables(serverIdList, db){
    serverIdList.forEach(server => {
        db.run(`CREATE TABLE IF NOT EXISTS Users_${server}(ServerId TEXT NOT NULL, UserId TEXT NOT NULL, Username TEXT NOT NULL, TotalUser INTEGER NOT NULL)`);
        db.run(`CREATE TABLE IF NOT EXISTS Channels_${server}(ServerId TEXT NOT NULL, ChannelId TEXT NOT NULL, ChannelName TEXT NOT NULL, TotalChannel INTEGER NOT NULL)`);
    })
}

client.login(BOT_TOKEN); 