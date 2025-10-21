const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const ROLES = [
  { name: "🔱 الملك", color: "#FFD700", perms: [] },
  { name: "🤴 ولي العهد", color: "#E6BE8A", perms: [] },
  { name: "🦅 القائد الأعلى", color: "#8B0000", perms: [] },
  { name: "🛡️ القائد", color: "#00008B", perms: [] },
  { name: "⚔️ رئيس الكتائب", color: "#708090", perms: [] },
  { name: "💣 المنفذ الملكي", color: "#000000", perms: [] },
  { name: "💼 الوكيل الملكي", color: "#1E90FF", perms: [] },
  { name: "💎 النبيل", color: "#4169E1", perms: [] },
  { name: "🦊 الفارس الذهبي", color: "#FFD700", perms: [] },
  { name: "⚜️ الفارس", color: "#C0C0C0", perms: [] },
  { name: "🎯 المتدرب المتقدم", color: "#87CEFA", perms: [] },
  { name: "🧢 المتدرب", color: "#D3D3D3", perms: [] },
  { name: "💰 الداعم", color: "#228B22", perms: [] },
  { name: "⛔ الموقوف", color: "#8B0000", perms: [] },
  { name: "⚫ المنفي", color: "#2F4F4F", perms: [] }
];

const CATEGORIES = [
  { name: "🏰 المقر الملكي", channels: [
    { name: "📜-المرسوم-الملكي", type: ChannelType.GuildText, perms: "leaders" },
    { name: "🕊️-بيانات-المملكة", type: ChannelType.GuildText, perms: "public_read" },
    { name: "💬-ساحة-النبلاء", type: ChannelType.GuildText, perms: "leaders" },
    { name: "🏛️-مجلس-المستشارين", type: ChannelType.GuildText, perms: "leaders" },
  ]},
  { name: "⚔️-القوات-الملكية", channels: [
    { name: "🛡️-أوامر-القائد-العام", type: ChannelType.GuildText, perms: "commanders" },
    { name: "⚔️-المهام-الميدانية", type: ChannelType.GuildText, perms: "operations" },
    { name: "🩸-سجلات-المعارك", type: ChannelType.GuildText, perms: "operations" },
    { name: "🗡️-تدريبات-العسكريين", type: ChannelType.GuildText, perms: "operations" },
    { name: "ميدان-العمليات", type: ChannelType.GuildVoice, perms: "operations" },
  ]},
  { name: "🕯️-شؤون-المملكة", channels: [
    { name: "🧾-سجلات-الولاء", type: ChannelType.GuildText, perms: "admins" },
    { name: "🎖️-طلبات-الترقية", type: ChannelType.GuildText, perms: "admins" },
    { name: "⚖️-التحقيقات-والقضايا", type: ChannelType.GuildText, perms: "admins" },
    { name: "💰-الخزينة-الملكية", type: ChannelType.GuildText, perms: "admins" },
  ]},
  { name: "🏹-سكان-المملكة", channels: [
    { name: "🙋-تقديم-طلب-انضمام", type: ChannelType.GuildText, perms: "public" },
    { name: "💬-ساحة-الشعب", type: ChannelType.GuildText, perms: "public" },
    { name: "🏅-أبطال-اليوم", type: ChannelType.GuildText, perms: "public" },
    { name: "📜-القوانين-الملكية", type: ChannelType.GuildText, perms: "public_read" },
  ]},
  { name: "🌹-الترفيه-الملكي", channels: [
    { name: "😂-النكت-والطرائف", type: ChannelType.GuildText, perms: "public" },
    { name: "🎵-الأغاني-والموسيقى", type: ChannelType.GuildText, perms: "public" },
    { name: "🎮-الصور-واللقطات", type: ChannelType.GuildText, perms: "public" },
    { name: "🧩-الألعاب-الجانبية", type: ChannelType.GuildText, perms: "public" },
    { name: "الاستراحة-الملكية", type: ChannelType.GuildVoice, perms: "public" },
  ]},
];

client.once('ready', () => {
  console.log(`🤴 Logged in as ${client.user.tag}`);
});

function roleExists(guild, name) {
  return guild.roles.cache.find(r => r.name === name);
}

async function createRoles(guild) {
  const created = {};
  for (const r of ROLES) {
    let role = roleExists(guild, r.name);
    if (!role) {
      role = await guild.roles.create({
        name: r.name,
        color: r.color,
        permissions: r.perms || [],
        reason: "إنشاء رولات العائلة الملكية",
      });
      console.log("Created role", r.name);
    } else {
      console.log("Role exists", r.name);
    }
    created[r.name] = role;
  }
  return created;
}

async function createCategory(guild, name) {
  let cat = guild.channels.cache.find(c => c.name === name && c.type === ChannelType.GuildCategory);
  if (!cat) {
    cat = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
    });
    console.log("Created category", name);
  } else {
    console.log("Category exists", name);
  }
  return cat;
}

function permsFor(guild, permKey, rolesMap) {
  const overwrites = [];
  const everyone = guild.roles.everyone;
  if (permKey === "leaders") {
    overwrites.push({ id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] });
    const allowed = ROLES.slice(0,6).map(r=>r.name); // top roles
    for (const name of allowed) {
      if (rolesMap[name]) overwrites.push({ id: rolesMap[name].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] });
    }
  } else if (permKey === "public_read") {
    overwrites.push({ id: everyone.id, allow: [PermissionFlagsBits.ViewChannel] });
  } else if (permKey === "public") {
    overwrites.push({ id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] });
  } else if (permKey === "admins") {
    overwrites.push({ id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] });
    const allowed = ["🔱 الملك","🤴 ولي العهد","🦅 القائد الأعلى","🛡️ القائد"];
    for (const name of allowed) {
      if (rolesMap[name]) overwrites.push({ id: rolesMap[name].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] });
    }
  } else if (permKey === "commanders") {
    overwrites.push({ id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] });
    const allowed = ["🔱 الملك","🤴 ولي العهد","🦅 القائد الأعلى","🛡️ القائد","⚔️ رئيس الكتائب","💣 المنفذ الملكي"];
    for (const name of allowed) {
      if (rolesMap[name]) overwrites.push({ id: rolesMap[name].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] });
    }
  } else if (permKey === "operations") {
    overwrites.push({ id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] });
    const allowed = ["🔱 الملك","🤴 ولي العهد","🦅 القائد الأعلى","🛡️ القائد","⚔️ رئيس الكتائب","💣 المنفذ الملكي","💼 الوكيل الملكي","🦊 الفارس الذهبي"];
    for (const name of allowed) {
      if (rolesMap[name]) overwrites.push({ id: rolesMap[name].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] });
    }
  }
  return overwrites;
}

async function createChannels(guild, rolesMap) {
  for (const cat of CATEGORIES) {
    const category = await createCategory(guild, cat.name);
    for (const ch of cat.channels) {
      let existing = guild.channels.cache.find(c => c.name === ch.name && c.parentId === category.id);
      if (!existing) {
        const overwrites = permsFor(guild, ch.perms, rolesMap);
        const created = await guild.channels.create({
          name: ch.name,
          type: ch.type,
          parent: category.id,
          permissionOverwrites: overwrites
        });
        console.log("Created channel", ch.name);
      } else {
        console.log("Channel exists", ch.name);
      }
    }
  }
}

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
  if (message.content === '!ping') return message.reply('🏰 البوت شغال يا ملك!');

  if (message.content === '!setup') {
    if (!isAdmin) return message.reply('🚫 لازم يكون عندك صلاحية إدارة السيرفر لتنفيذ هذا الأمر.');
    await message.reply('🔧 جاري إنشاء الرولات والرومات... انتظر لحظة.');
    try {
      const rolesMap = await createRoles(message.guild);
      await createChannels(message.guild, rolesMap);
      await message.reply('✅ انتهى الإعداد: الرولات والرومات انعملت بنجاح.');
    } catch (err) {
      console.error(err);
      await message.reply('❌ صار خطأ أثناء الإعداد. شيك الصلاحيات واللوقس.');
    }
  }

});
client.login(process.env.TOKEN);
