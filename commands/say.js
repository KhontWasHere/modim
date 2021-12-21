const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
  let boost = message.guild.members.filter(r=>r.roles.has('')).size
   var tagdakiler = 0;
  let tag = "☆";
  message.guild.members.forEach(member => {
    if(member.user.username.includes(tag)) {
      tagdakiler = tagdakiler+1
    }
  })
 
  const voiceChannels = message.guild.channels.filter(c => c.type === 'voice');
    let count = 0;
   
    for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
      const emoji = client.emojis.find(emoji => emoji.name === "krkr"); // emojinin adını yazın.
  const avezyembed = new Discord.RichEmbed()
  .setThumbnail(client.user.avatarURL)
  .setColor("black")
  .addField(`${emoji} **Ses Kanallarında Bulunan Kişi Sayısı** ${emoji}`, `${count} **Kişi Bulunmaktadır.**`)  // emoji yazan yerlere yazdıgınız emoji gelecektir.
.addField(`${emoji}  **Sunucuda Bulunan Kişi Sayısı** ${emoji} `,`${message.guild.memberCount} **Kişi Bulunmaktadır.**`)
.addField(`${emoji} **Taglı Üye Sayısı** ${emoji}`,` ${tagdakiler}` +  ` **Kişi Tagımızda!**`)
  .addField(`${emoji} **Sunucu Booster Sayısı** ${emoji}`,` ${boost}` +  ` **Kişi Sunucuyu Boostlamış**`)
        .setFooter(`İmmortal`)
  message.channel.sendEmbed(avezyembed)
  message.react("<a:mavimsitikimmo:921679213893910549>")

}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'say',
  description: ' Sunucudaki ve sesdeki üyeleri gösterir',
  usage: '!say'
};;
