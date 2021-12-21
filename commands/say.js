const Discord = require("discord.js");

const mapping = {
  " ": "   ",
 "0": "<a:sifir:921830098393518080>",
 "1": "<a:bir:921828914303762532>",
 "2": "<a:iki:921828958218117200>",
 "3": "<a:uc:921828996516307005>",
 "4": "<a:dort:921829037893103707>",
 "5": "<a:bes:921829079425122314>",
 "6": "<a:alti:921829109842194542>",
 "7": "<a:yedi:921829137914667078>",
 "8": "<a:sekiz:921829197830291496>",
 "9": "<a:dokuz:921829234786312262>",
 "!": "<a:YanpSnennleGif:922220389084581949>",
 "?": ":question:",
 "#": "<:HashtagPng:922220446684942366>",
 "*": ":asterisk:"
};

let tagcik = '☆'//sizin taginiz
"abcdefghijklmnopqr".split("").forEach(c => {
mapping[c] = mapping[c.toUpperCase()] = `:regional_indicator_${c}:`;
});

exports.run = function(client, message, args) {

let selam = message.guild.members.cache.filter(
m => m.user.presence.status === "offline"
).size; 
let offlinee = '**Çevrimdışı Kişi Sayısı: **' +
`${selam}`
.split("")
.map(c => mapping[c] || c)
.join(" ")
let plasmic = message.guild.memberCount;
let sunucu = '**Sunucudaki Kişi Sayısı: **' + 
`${plasmic}`
.split("")
.map(c => mapping[c] || c)
.join(" ")
let abcqwe = message.guild.members.cache.filter(m => !m.user.bot && m.user.presence.status !== "offline").size;;
let onlinee = '**Çevrimiçi Kişi Sayısı: **' +
`${abcqwe}`
.split("")
.map(c => mapping[c] || c)
.join(" ")

let aw = message.guild.members.cache.filter(m => m.user.username.includes(tagcik)).size
let tagg = '**Tagi Kullanan Kişi Sayısı: **' +
`${aw}`
.split("")
.map(c => mapping[c] || c)
.join("")

let keremtheartist = message.guild.members.cache.filter(
m => m.user.presence.status === "idle"
).size; 
let idlee = '**Boştaki Kişi Sayısı: **' +
`${keremtheartist}`
.split("")
.map(c => mapping[c] || c)
.join(" ")

let donotdisturb = message.guild.members.cache.filter(
m => m.user.presence.status === "dnd"
).size; 
let dndd = '**Rahatsız Etmeyindeki Kişi SayısI: **' +
`${donotdisturb}`
.split("")
.map(c => mapping[c] || c)
.join(" ")


const ciguli = message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b); 
let sess = '**Sesteki Kişi Sayısı: **' +
`${ciguli}`
.split("")
.map(c => mapping[c] || c)
.join(" ")

const kizciklar = message.guild.roles.cache.get("KADIN ROLÜNÜZÜN IDSİ").members.size //KADINROLÜNÜZÜNIDSİNİGİRİN
let kizz = '**Kadın Kullanıcıların Sayısı: **' +
`${kizciklar}`
.split("")
.map(c => mapping[c] || c)
.join(" ")



const erkekcikler = message.guild.roles.cache.get("ERKEKROLÜNÜZÜIDSİ").members.size; //ERKEK ROLÜNÜZÜN IDSİNİ GİRİN
let erkekk = '**Erkek Kullanıcıların Sayısı: **' +
`${erkekcikler}`
.split("")
.map(c => mapping[c] || c)
.join(" ")


const theartist = new Discord.MessageEmbed()
.setTitle(`Sunucu İstatikleri`)
.setDescription(`
${sunucu}

${tagg}

${offlinee}

${onlinee}

${idlee}

${dndd}

${sess}

${kizz}

${erkekk}
`)
.setColor("BLACK")
.setFooter(`Khont`)


message.channel.send(theartist)

};

exports.conf = {
enabled: true,
guildOnly: false,
aliases: ["gelişmiş-say"],
permLevel: 0
};

exports.help = {
name: "say",
usage: "say",
description: "sunucuyu sayar sj"
};
