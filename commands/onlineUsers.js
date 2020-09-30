module.exports = {
    name: 'online-users',
    description: 'shows online users',
    execute(message, client){
      let onlineMembers;
      let offlineMembers;
      let idleMembers;
      let dndMembers;
      let botMembers;
    
      client.guilds.cache.forEach(guild => {
    
         onlineMembers = guild.members.cache.filter(member => (member.presence.status === 'online' && !member.user.bot));
         offlineMembers = guild.members.cache.filter(member => (member.presence.status === 'offline' && !member.user.bot))
         idleMembers = guild.members.cache.filter(member => member.presence.status === 'idle')
         dndMembers = guild.members.cache.filter(member => member.presence.status === 'dnd')
         botMembers = guild.members.cache.filter(member => member.user.bot)
    
    
         message.channel.send(`-------${guild.name}-------`);
    
         onlineMembers.forEach(online => {
                message.channel.send(`${online.user.username} 🟢`);
            })
            offlineMembers.forEach(offline => {
                message.channel.send(`${offline.user.username} 🔴`);
            })
            idleMembers.forEach(idle => {
                message.channel.send(`${idle.user.username} 🟡`);
            })
            dndMembers.forEach(dnd => {
                message.channel.send(`${dnd.user.username} ⚪`);
            })
            message.channel.send(`---Bots---`);
            botMembers.forEach(bot => {
                message.channel.send(bot.user.username);
            })
      })
   }
}