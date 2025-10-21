const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
  console.log(`✅ تم تسجيل الدخول كبوت: ${client.user.tag}`);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return console.error("❌ لم يتم العثور على السيرفر. تأكد من الـ GUILD_ID");

  // 🧱 إنشاء رتب الإدارة (12 رتبة)
  const adminRoles = [
    { name: "👑 Founder", color: "#FFD700" },
    { name: "👑 Vice Founder", color: "#DAA520" },
    { name: "💼 Director", color: "#E6E6FA" },
    { name: "💼 Deputy Director", color: "#B0C4DE" },
    { name: "⚔️ Commander", color: "#1E90FF" },
    { name: "🛡️ Captain", color: "#00CED1" },
    { name: "🧭 Supervisor", color: "#4682B4" },
    { name: "⚙️ Manager", color: "#708090" },
    { name: "📋 Officer", color: "#2E8B57" },
    { name: "🎖️ Lieutenant", color: "#3CB371" },
    { name: "🔰 Recruit", color: "#808080" },
    { name: "🧩 Trial Staff", color: "#A9A9A9" },
  ];

  for (const role of adminRoles) {
    if (!guild.roles.cache.find(r => r.name === role.name)) {
      await guild.roles.create({ name: role.name, color: role.color, reason: "إعداد نظام German Family" });
    }
  }

  // 👨‍👩‍👧‍👦 رتب العائلة
  const familyRoles = [
    "👴 الجد",
    "👵 الجدة",
    "👨 الأب",
    "👩 الأم",
    "👨‍💼 العم",
    "👩‍💼 العمة",
    "👨‍🏫 الخال",
    "👩‍🏫 الخالة",
    "🧑‍🦰 الأخ الكبير",
    "🧑 الأخ المتوسط",
    "👦 الأخ الصغير",
    "👨‍👦 الابن الكبير",
    "👦 الابن المتوسط",
    "👶 الابن الصغير",
    "🏡 German Family Member",
  ];

  for (const name of familyRoles) {
    if (!guild.roles.cache.find(r => r.name === name)) {
      await guild.roles.create({ name, color: "#ffffff", reason: "رتب العائلة" });
    }
  }

  // 🏠 إنشاء الرومات
  const channels = [
    { name: "📜│قوانين-العائلة", type: 0 },
    { name: "📢│اخبار-العائلة", type: 0 },
    { name: "💬│شات-عام", type: 0 },
    { name: "🎭│قسم-الترفيه", type: 4 },
    { name: "🎵│غناء-وصوت", type: 2 },
    { name: "🧾│تفعيل-الأعضاء", type: 0 },
  ];

  for (const ch of channels) {
    if (!guild.channels.cache.find(c => c.name === ch.name)) {
      await guild.channels.create({
        name: ch.name,
        type: ch.type,
        reason: "إنشاء قنوات German Family",
      });
    }
  }

  console.log("✅ تم إنشاء الرتب والرومات بنجاح!");
});

client.login(process.env.TOKEN);
