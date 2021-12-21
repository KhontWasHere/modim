const { Client, MessageEmbed, Collection } = require("discord.js");
const Discord = require("discord.js");
const client = new Client
const fs = require("fs");
const config = require("./config.json");
const db = require("quick.db");
const moment = require('moment');
const ms = require("ms")
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();


client.on("ready", () => {
    client.user.setPresence({activity: {name: (config.bot.botdurum)}, status: "online"})
    client.channels.cache.get(config.channels.voicechannel).join()
})

fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})

client.on('message', message => {
    if (!message.guild || message.author.bot || !message.content.startsWith(config.bot.prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args)
})

client.on("guildBanRemove", function (guild, user) {
    if (db.get(`ban.${user.id}`) === true) guild.members.ban(user.id, { reason: "Açılmaz banke." })
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!oldState.channelID && newState.channelID) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanala girdi!`);
    if (oldState.channelID && !newState.channelID) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(oldState.channelID).name}\` adlı sesli kanaldan ayrıldı!`);
    if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi ses kanalını değiştirdi! (\`${newState.guild.channels.cache.get(oldState.channelID).name}\` - \`${newState.guild.channels.cache.get(newState.channelID).name}\`)`);
    if (oldState.channelID && oldState.selfMute && !newState.selfMute) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendi susturmasını kaldırdı!`);
    if (oldState.channelID && !oldState.selfMute && newState.selfMute) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendini susturdu!`);
    if (oldState.channelID && oldState.selfDeaf && !newState.selfDeaf) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendi sağırlaştırmasını kaldırdı!`);
    if (oldState.channelID && !oldState.selfDeaf && newState.selfDeaf) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendini sağırlaştırdı!`);
});

client.on('messageDelete', (message) => {
    if (!message.guild || message.author.bot) return;
    const embed = new Discord.MessageEmbed()
        .setAuthor("Mesaj Silindi", message.author.avatarURL({ dynamic: true }))
        .addField("🔹 **Mesaj Sahibi**", `${message.author.tag}`, true)
        .addField("🔹 **Mesaj Kanalı**", `${message.channel}`, true)
        .addField("🔹 **Mesaj Silinme Tarihi**", `**${moment().format('LLL')}**`, true)
        .setDescription(`🔹 **Silinen mesaj:** \`${message.content.replace("`", "")}\``)
        .setTimestamp()
        .setColor("#00a3aa")
        .setFooter("Mesaj silindiği saat:")
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
    client.channels.cache.get(config.logs.messagelog).send(embed)
})

client.on("messageDelete", async (message) => {
    if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
    let snipe = {
        mesaj: message.content,
        mesajyazan: message.author.id,
        ytarihi: message.createdTimestamp,
        starihi: Date.now(),
        kanal: message.channel.id
    }
    await db.set(`snipe.${message.guild.id}`, snipe)
});

client.on("message", message => {
    let embed = new MessageEmbed()
        .setFooter(`Norm Devoloped`)
    if (!message.guild) return;
    if (message.content.includes(`afk`)) return;
    let etiket = message.mentions.users.first()
    let uye = db.fetch(`user_${message.author.id}_${message.guild.id}`)
    let nickk = db.fetch(`nick_${message.author.id}_${message.guild.id}`)
    if (etiket) {
        let reason = db.fetch(`sebep_${etiket.id}_${message.guild.id}`)
        let uye2 = db.fetch(`user_${etiket.id}_${message.guild.id}`)
        if (message.content.includes(uye2)) {
            let time = db.fetch(`afktime_${message.guild.id}`);
            let timeObj = ms(Date.now() - time);
            message.channel.send(embed.setDescription(`${etiket} adlı kullanıcı **${reason}** sebebiyle \`${timeObj}\` süresi boyunca afk.`).setColor("#2F3136"))
        }
    }
    if (message.author.id === uye) {
        message.member.setNickname(nickk)
        db.delete(`sebep_${message.author.id}_${message.guild.id}`)
        db.delete(`user_${message.author.id}_${message.guild.id}`)
        db.delete(`nick_${message.author.id}_${message.guild.id}`)
        db.delete(`user_${message.author.id}_${message.guild.id}`);
        db.delete(`afktime_${message.guild.id}`)
        message.reply(`Başarıyla \`AFK\` modundan çıkış yaptın.`)
    }
})

client.on("messageDelete", async message => {
    if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
    await db.set(`snipe.${message.guild.id}.${message.channel.id}`, { yazar: message.author.id, yazilmaTarihi: message.createdTimestamp, silinmeTarihi: Date.now(), dosya: message.attachments.first() ? true : false });
    if (message.content) db.set(`snipe.${message.guild.id}.${message.channel.id}.icerik`, message.content);
});

client.on('guildMemberAdd', (member) => {
    if (member.user.bot) return;
    db.add(`girişçıkış.${member.id}`, 1);
    if (db.get(`girişçıkış.${member.id}`) >= 5) {//3 defa çık gir yaparsa
        member.guild.members.ban(member.id, { reason: `Sunucudan kısa sürede çok fazla gir çık yapmak.` })
        client.channels.cache.get(config.penals.ban.log).send(`${member} adlı kullanıcı sunucuya kısa süre içinde defalarca çık gir yaptığı için sunucudan banlandı!`)
member.send("Sunucuya kısa süre içinde defalarca çık gir yaptığın için sunucudan banlandın!")
    }
});
setInterval(() => {
    db.all().filter(data => data.ID.endsWith("girişçıkış")).forEach(data => {
        db.delete(data.ID)
    })
}, 60 * 1000 * 5)

const iltifatlar = [
    "Bu mesajımı sana kalbimin en şiddetli sesiyle yolluyorum seni seviyorum.",
    "Aşkımı dağlara yazacaktım aşkımdan büyük dağ bulamadım.",
    "Seni yaşadığım kadar hayatı yaşasaydım hayatımda kimse olmazdı aşkım.",
    "Saçlarının 1 teli olmak isterdim hep yanında kalmak için.",
    "Dertlerini bana ver sevinçler senin olsun. Sen sevilmeye değersin.",
    "Sen benim mucizemsin, mucizelere inanma sebebimsin.",
	"Önce sesin gelir aklıma, çaresiz kaldıkça hep seni düşünürüm.",
	"Sevgilim bugün süper güzel oldun saçlara bak dağınık ama ayrı bir havası var.",
	"O gülüşündeki gamze olmak isterim güzelliğine güzellik katmak için.",
	"Birbirimizi sevmek için çünkülere ihtiyacımız yok. Biz karışmışız çoktan birbirimize.",
	"Hadi bırakalım inadı. Yaşayalım hayatı, senin için geldim yeniden dünyaya.",
	"Sen olmadan nasıl var olacağımı bilmiyorum.",
	"Narinliğini gören kelebekler seni kıskanır.",
	"Güneş mi doğdu yoksa sen mi uyandın?",
	"Kusursuz tavırların var. Korkunç kararlar verdiğimde beni yargılamadığın için sana minnettarım.",
	"Gül güzelliğinden utanır solar seni gördüğü zaman.",
	"Hayatımda, ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
	"adamın amısın sen oç",
	"şuna bir bak şuna bir bak",
	"Çay dağıtmaya Geldi"
];
// İLTİFATLARI BU ŞEKİLDE İSTEDİĞİNİZ KADAR ÇOĞALTABİLİRSİNİZ
var iltifatSayi = 0; // Buraya ellemeyin!
client.on("message", async message => {
    if (message.channel.id !== config.channels.chat || message.author.bot) return;
    iltifatSayi++
    if (iltifatSayi >= 80) { // 50 yazan yer, 50 mesajda bir iltifat edeceğini gösterir, değiştirebilirsiniz.
        iltifatSayi = 0;
        const random = Math.floor(Math.random() * ((iltifatlar).length - 1) + 1);
        message.reply(`**${(iltifatlar)[random]}**`);
    };
});

client.login(config.token).then(x => console.log(`[BOT] ${client.user.username} Olarak giriş yaptı`)).catch(err => console.log(`[BOT] Giriş yapamadı sebep: ${err}`))


client.on('guildMemberRemove' , member => {
      db.set(`roles_${member.id}`, member.roles.cache.map(x => x.id))
        db.set(`isim_${member.id}`, member.displayName)
})

client.on('guildMemberAdd', (member) => {
    const role = db.fetch(`roles_${member.id}`)
    if (!role) return
  member.roles.set(role)
});

client.on('guildMemberAdd', (member) => {
    const name = db.fetch(`isim_${member.id}`)
    if (!name) return
  member.setNickname(name)
});

    //----------------------

