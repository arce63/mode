const Discord = require("discord.js"); //
const client = new Discord.Client(); //
const ayarlar = require("./ayarlar.json"); //
const chalk = require("chalk"); //
const moment = require("moment"); //
var Jimp = require("jimp"); //
const { Client, Util } = require("discord.js"); //
const fs = require("fs"); //
const db = require("quick.db"); //
const express = require("express"); //
require("./util/eventLoader.js")(client); //
const path = require("path"); //
const snekfetch = require("snekfetch"); //
const ms = require("ms"); //
const tags = require("common-tags");
const { config } = require("process");
//

var prefix = ayarlar.prefix; //
//
const log = message => {
  //
  console.log(`${message}`); //
};

client.commands = new Discord.Collection(); //
client.aliases = new Discord.Collection(); //
fs.readdir("./komutlar/", (err, files) => {
  //
  if (err) console.error(err); //
  log(`‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒
    ${files.length} komut yüklenecek.
‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒`); //
  files.forEach(f => {
    //
    let props = require(`./komutlar/${f}`); //
    log(`[KOMUT] | ${props.help.name} Eklendi.`); //
    client.commands.set(props.help.name, props); //
    props.conf.aliases.forEach(alias => {
      //
      client.aliases.set(alias, props.help.name); //
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }

  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});
client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(process.env.token);

//------------------------------------------------------------------------------------------------------------\\
client.config = {
  sunucuid: "856275624787443752",

  chat: "856293666405351451",

  seskanal: "856275624787443756",

  booter: "",

  toplantikanal: "852714382785773588",

  katıldırol: "858515784124727296",

  owner: "856278189513244703",

  yetkilirol1: "857280729335857192",

  yetkilialim: "860566934684172349",

  yetkili1: "857280729335857192",

  yetkili2: "857277365184102430",

  yetkili3: "856476175063973908",

  yetkilog: "860569444732633100",

  banhammer: "856478952348581908",

  mutehammer: "856476175063973908",

  vmutehammer: "860568734624514069",

  banlog: "856479032765186048",

  jaillog: "860569554278809620",

  mutelog: "856476370610683924",

  vmutelog: "856476370610683924",

  onayemoji: "<a:oldu:856475609826590750>",
  redemoji: "<a:carpi:856475633339990037>",
  sayı0: "<a:0_:856279442837471233>",
  sayı1: "<a:1_:856279476383121431>",
  sayı2: "<a:2_:856279506918703115>",
  sayı3: "<a:3_:856279651231465472>",
  sayı4: "<a:4_:856279665403756604>",
  sayı5: "<a:5_:856279926609281084>",
  sayı6: "<a:6_:856279944007254066>",
  sayı7: "<a:7_:856279956081606707>",
  sayı8: "<a:8_:856279971597123595>",
  sayı9: "<a:9_:856279983101575178>",

  booster: "856455728130424844",

  muterol: "856476160710803496",
  footer: "Matchless Moderasyon",

  ///////////////ROLLER////////
  ekip: "857278405274894396",

  rollog: "860569963039424552"
};
///////////////////////////////////////////////////////

client.on("messageDelete", message => {
  const data = require("quick.db");
  data.set(`snipe.mesaj.${message.guild.id}`, message.content);
  data.set(`snipe.id.${message.guild.id}`, message.author.id);
});

// Main Dosyası

client.on("userUpdate", async (oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    const taginlo = client.config.tag;
    const inlosunucu = client.config.sunucuid;
    const inlokanal = client.config.taglog;
    const rolinlo = client.config.taglırol;

    try {
      if (
        newUser.username.includes(taginlo) &&
        !client.guilds.cache
          .get(inlosunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(rolinlo)
      ) {
        await client.channels.cache
          .get(inlokanal)
          .send(
            new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `${newUser} ${taginlo} Tagımızı Aldığı İçin <@&${rolinlo}> Rolünü Verdim`
              )
          );
        await client.guilds.cache
          .get(inlosunucu)
          .members.cache.get(newUser.id)
          .roles.add(rolinlo);
      }
      if (
        !newUser.username.includes(taginlo) &&
        client.guilds.cache
          .get(inlosunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(rolinlo)
      ) {
        await client.channels.cache
          .get(inlokanal)
          .send(
            new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `${newUser} ${taginlo} Tagımızı Çıkardığı İçin <@&${rolinlo}> Rolünüz Alındı`
              )
          );
        await client.guilds.cache
          .get(inlosunucu)
          .members.cache.get(newUser.id)
          .roles.remove(rolinlo);
      }
    } catch (e) {
      console.log(`Bir hata oluştu! ${e}`);
    }
  }
});
//------------------------------------------------------------------------------------------------------------\\

client.on("message", async msg => {
  if (!msg.guild) return;
  if (msg.content.startsWith(ayarlar.prefix + "afk")) return;

  let afk = msg.mentions.users.first();

  const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`);

  const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`);
  if (afk) {
    const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`);
    const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`);
    if (msg.content.includes(kisi3)) {
      msg.channel.send(
        new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription(
            `<@` +
              msg.author.id +
              `> Etiketlediğiniz Kişi Afk \nSebep : ${sebep}`
          )
      );
    }
  }
  if (msg.author.id === kisi) {
    msg.channel
      .send(
        new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription(`<@${kisi}> Başarıyla Afk Modundan Çıktınız`)
      )
      .then(x => x.delete({ timeout: 5000 }));
    db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`);
    db.delete(`afkid_${msg.author.id}_${msg.guild.id}`);
    db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`);
    msg.member.setNickname(isim);
  }
});
///////////////////////////////////////////////////////

client.on("guildMemberAdd", member => {
  var moment = require("moment");
  require("moment-duration-format");
  moment.locale("tr");
  var { Permissions } = require("discord.js");
  var x = moment(member.user.createdAt)
    .add(7, "days")
    .fromNow();
  var user = member.user;
  x = x.replace("birkaç saniye önce", " ");
  if (!x.includes("önce") || x.includes("sonra") || x == " ") {
    const kayıtsız = client.config.kayıtsız;
    const kayıtsız1 = client.config.kayıtsız1;
    var rol = client.config.şüphelihesap;
    var jail = client.config.jailrol;
    var kayıtsız3 = client.config.kayıtsız;
    member.roles.add(rol);
    member.roles.remove(client.config.kayıtsız);
    member.roles.remove(client.config.kayıtsız1);

    member.user.send(
      "Selam Dostum Ne Yazık ki Sana Kötü Bir Haberim Var Hesabın 1 Hafta Gibi Kısa Bir Sürede Açıldığı İçin Fake Hesap Katagorisine Giriyorsun Lütfen Bir Yetkiliyle İletişime Geç Onlar Sana Yardımcı Olucaktır."
    );
    setTimeout(() => {}, 1000);
  } else {
  }
});
//--------------------------------------------------------------------------------------\\

////----------------------- iltifat-----------------------\\\\

const iltifatlar = [
  "Gözlerindeki saklı cenneti benden başkası fark etsin istemiyorum.",
  "Mavi gözlerin, gökyüzü oldu dünyamın.",
  "Parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.",
  "Huzur kokuyor geçtiğin her yer.",
  "Öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı.",
  "Gözlerinin hareketi bile yeter  benim aklımı başımdan almaya.",
  "Güller bile kıskanır seni gördükleri zaman kendi güzelliklerini.",
  "Hiç yazılmamış bir şiirsin sen, daha önce eşi benzeri olmayan.",
  "Adım şaire çıktı civarda. Kimse senin şiir olduğunun farkında değil henüz.",
  "Etkili gülüş kavramını ben senden öğrendim.",
  "Seni anlatmaya kelimeler bulamıyorum. Nasıl anlatacağımı bilemediğim için seni kimselere anlatamıyorum.",
  "Gözlerinle baharı getirdin garip gönlüme.",
  "Bir gülüşün ile çiçek açıyor bahçemdeki her bir çiçek.",
  "Yuva kokuyor kucağın. Sarılınca seninle yuva kurası geliyor insanın.",
  "Sen bu  dünyadaki bütün şarkıların tek sahibisin. Sana yazılıyor bütün şarkılar ve şiirler. Adın geçiyor bütün namelerde.",
  "Seni yüreğimde taşıyorum ben, sırtımda taşımak ne kelime. Ömrüm boyunca çekmeye hazırım her anlamda senin yükünü.",
  "Hayatıma gelerek hayatımdaki bütün önemli şeylerin önemsiz olmasını sağladın. Artık sensin tek önem verdiğim şu hayatta.",
  "Sen benim bu hayattaki en büyük duamsın.  Gözlerin adeta bir ay parçası. Işık oluyorsun karanlık gecelerime.",
  "Aynı zaman diliminde yaşamak benim için büyük ödüldür.",
  "Biraz Çevrendeki İnsanları Takarmısın ?",
  "İğrenç İnsansın!",
  "Kalbime giden yolu aydınlatıyor gözlerin.  Sadece sen görebilirsin kalbimi. Ve sadece ben hissedebilirim bana karşı olan hislerini.",
  "Onu Bunu Boşver de bize gel 2 bira içelim.",
  "Taş gibi kızsın ama okey taşı… Elden elde gidiyorsun farkında değilsin.",
  "Ben seni çok sevdim...",
  "Mucizelerden bahsediyordum.",
  "Yaşanılacak en güzel mevsim sensin.",
  "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.",
  "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.",
  "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.",
  "Denize kıyısı olan şehrin huzuru birikmiş yüzüne.",
  "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.",
  "Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.",
  "Ne tatlısın sen öyle. Akşam gel de iki bira içelim.",
  "Bir gamzen var sanki cennette bir çukur.",
  "Gecemi aydınlatan yıldızımsın.",
  "Ponçik burnundan ısırırım seni",
  "Bu dünyanın 8. harikası olma ihtimalin?",
  "fıstık naber?",
  "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?",
  "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.",
  "Müsaitsen aklım bu gece sende kalacak.",
  "Gemim olsa ne yazar liman sen olmadıktan sonra...",
  "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.",
  "Sabahları görmek istediğim ilk şey sensin.",
  "Mutluluk ne diye sorsalar- cevabı gülüşünde ve o sıcak bakışında arardım.",
  "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
  "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.",
  "Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.",
  "Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.",
  "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.",
  "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?",
  "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.",
  "Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...",
  "Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.",
  "Telaşımı hoş gör, ıslandığım ilk yağmursun.",
  "Gülüşün ne güzel öyle- cumhuriyetin gelişi gibi...",
  "Arcenioya selam söyle :))"
];
// İLTİFATLARI BU ŞEKİLDE İSTEDİĞİNİZ KADAR ÇOĞALTABİLİRSİNİZ
client.on("message", async message => {
  if (message.channel.id !== client.config.chat) return;
  let Knavedev = db.get("chatiltifat");
  await db.add("chatiltifat", 1);
  if (Knavedev >= 50) {
    // 50 yazan yer, 50 mesajda bir iltifat edeceğini gösterir, değiştirebilirsiniz.
    db.delete("chatiltifat");
    const random = Math.floor(Math.random() * (iltifatlar.length - 1) + 1);
    message.reply(`${iltifatlar[random]}`);
  }
});

///////////////////member remove
client.on("guildMemberRemove", member => {
  if (member.roles.cache.has(client.config.kayıtsız)) return;
  if (member.roles.cache.has(client.config.kayıtsız1)) return;
  db.get(`isimler_${member.user.id}`);
  db.push(
    `isimler_${member.id}`,
    `\` ${member.displayName} \` (sunucudan ayrılma)`
  );
});

//----------------------TAG-KONTROL----------------------\\     STG

client.on("guildMemberAdd", member => {
  member.setNickname("✯ İsim | Yaş");
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === ".tag") {
    msg.channel.send("✯");
  }
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === "!tag") {
    msg.channel.send("✯");
  }
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === "+tag") {
    msg.channel.send("✯");
  }
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === "?tag") {
    msg.channel.send("✯");
  }
});

client.on("guildMemberAdd", member => {
  let sunucuid = "856275624787443752";
  let tag = ["✯"];
  let rol = "857278405274894396";
  if (member.user.username.includes(tag)) {
    member.roles.add(rol);
    const tagalma = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(
        `<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı, o doğuştan beri bizden !`
      )
      .setTimestamp();
    client.channels.cache.get("860570283269423117").send(tagalma);
  }
});

client.on("userUpdate", async (oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    const tag = ["✯"];
    const sunucu = "856275624787443752";
    const kanal = "860570283269423117";
    const rol = "857278405274894396";

    try {
      if (
        newUser.username.includes(tag) &&
        !client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(rol)
      ) {
        await client.channels.cache
          .get(kanal)
          .send(
            new Discord.MessageEmbed()
              .setColor("GREEN")
              .setDescription(
                `${newUser} ${tag} Tagımızı Aldığı İçin <@&${rol}> Rolünü Verdim`
              )
          );
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.add(rol);
      }
      if (
        !newUser.username.includes(tag) &&
        client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(rol)
      ) {
        await client.channels.cache
          .get(kanal)
          .send(
            new Discord.MessageEmbed()
              .setColor("RED")
              .setDescription(
                `${newUser} ${tag} Tagımızı Çıkardığı İçin <@&${rol}> Rolünü Aldım`
              )
          );
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.remove(rol);
      }
    } catch (e) {
      console.log(`Bir hata oluştu! ${e}`);
    }
  }
});
