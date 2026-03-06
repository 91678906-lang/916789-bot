const { Client, PermissionsBitField, ActivityType, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const bot = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers']
});

let welcomeConfig = {};

if (fs.existsSync('./welcome.json')) {
  welcomeConfig = JSON.parse(fs.readFileSync('./welcome.json', 'utf8'));
}

bot.login(process.env.DISCORD_TOKEN)
.then(() => console.log("Bot connecté"))
.catch(err => console.log("Erreur connexion :", err));

bot.on('ready', async () => {

    console.log(`Connecté en tant que ${bot.user.tag}`);

    bot.user.setActivity("Bot par 916789", {
        type: ActivityType.Playing
    });

    await bot.application.commands.set([
        {
            name: "setwelcome",
            description: "Définir le salon de bienvenue",
            options: [
                {
                    name: "channel",
                    description: "Salon de bienvenue",
                    type: 7,
                    required: true
                }
            ]
        },
        {
            name: "ping",
            description: "Voir le ping du bot"
        }
    ]);

    console.log("Commandes chargées");

});

bot.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {

        const ping = bot.ws.ping;

        const embed = new EmbedBuilder()
        .setColor("#11151c")
        .setTitle("Ping")
        .setDescription(`Ping du bot : ${ping}ms`);

        interaction.reply({ embeds:[embed] });

    }

    if (interaction.commandName === "setwelcome") {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

            return interaction.reply({
                content:"Tu dois être admin.",
                ephemeral:true
            });

        }

        const channel = interaction.options.getChannel("channel");

        welcomeConfig[interaction.guild.id] = {
            channelId: channel.id
        };

        fs.writeFileSync("./welcome.json", JSON.stringify(welcomeConfig,null,4));

        interaction.reply({
            content:`Salon de bienvenue défini : ${channel}`,
            ephemeral:true
        });

    }

});

bot.on("guildMemberAdd", async member => {

    const guildConfig = welcomeConfig[member.guild.id];

    if (!guildConfig) return;

    const channel = member.guild.channels.cache.get(guildConfig.channelId);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#11151c")
    .setTitle("Ho ! Un nouveau membre !")
    .setDescription(`🎉Bienvenue <@${member.id}> sur **${member.guild.name}**🎉 !`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

    channel.send(`<@${member.id}>`);
    channel.send({embeds:[embed]});

});
