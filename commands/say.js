const yedlixdiscord = require('discord.js');

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["bilgi", "sunucubilgi", "sunucu-bilgi", "sb"],
  permLevel: 0,
  kategori: "bot",
};

exports.help = {
  name: 'say',
  description: 'yedlix',
  usage: 'yedlix',

};
exports.run = async (client, message, args) => {
    var tagdakiler = 0;
  let tag = "☆";
  message.guild.members.forEach(member => {
    if(member.user.username.includes(tag)) {
      tagdakiler = tagdakiler+1
  const seskanallari = message.guild.channels.cache.filter(c => c.type === 'voice');
  let yedlix3 = 0
  let  yedlix2 = message.guild.members.cache.filter(m => !m.user.bot && m.user.presence.status !== "offline").size
  let metinkanallari = message.guild.channels.cache.filter(m => m.type == "text").size;
  for (const [id, voiceChannel] of seskanallari) yedlix3 += voiceChannel.members.size;
  const yedlix = new yedlixdiscord.MessageEmbed()
  .setColor("0x36393F")
  .setTitle("İmmortal")
  .setFooter("İmmortal")
  .setTimestamp()
  .setDescription(`
 Toplam üye sayısı: **${message.guild.memberCount}**
 Toplam çevrimiçi üye sayısı: **${yedlix2}**
Taglı Üye Sayısı: ${tagdakiler}` +  ` **Kişi Tagımızda!**
 Toplam metin kanalı sayısı: **${metinkanallari}**
 Toplam ses kanalı sayısı: **${seskanallari.size}**
 Toplam çevrimiçi durumda olan üye sayısı: **${message.guild.members.cache.filter(o => o.presence.status === 'online').size}**
 Toplam boşta durumda olan üye sayısı: **${message.guild.members.cache.filter(i => i.presence.status === 'idle').size}**
 Toplam rahatsız etme durumda olan üye sayısı: **${message.guild.members.cache.filter(i => i.presence.status === 'dnd').size}**
`)
  message.channel.send(yedlix)
  }
