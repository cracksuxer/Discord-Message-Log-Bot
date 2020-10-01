module.exports = {
    name: 'online-users',
    description: 'shows online users',
    execute(message, client){
      let onlineMembers;
      let offlineMembers;
      let idleMembers;
      let dndMembers;
      let botMembers;
      const guildId = message.guild.id;
      const guildName = message.guild.name;
    
      const guidlUsers = client.guilds.cache.get(guildId);
    
         onlineMembers = guidlUsers.members.cache.filter(member => (member.presence.status === 'online' && !member.user.bot));
         offlineMembers = guidlUsers.members.cache.filter(member => (member.presence.status === 'offline' && !member.user.bot))
         idleMembers = guidlUsers.members.cache.filter(member => member.presence.status === 'idle')
         dndMembers = guidlUsers.members.cache.filter(member => member.presence.status === 'dnd')
         botMembers = guidlUsers.members.cache.filter(member => member.user.bot)
    
    
         message.channel.send(`-------${guildName}-------`);
    
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
   }
}