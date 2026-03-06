const { Client, PermissionsBitField, ActivityType, EmbedBuilder } = require('discord.js');

const bot = new Client({
    intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers']
});

console.log('Connexion au bot ....');

bot.login(process.env.DISCORD_TOKEN)
.then(() => console.log('Connecté au bot !'))
.catch(error => console.log('Connexion impossible : ' + error));

bot.on('ready', async () => {

    console.log(`Bot connecté en tant que ${bot.user.tag}`);

    bot.user.setActivity('Bot by 916789', { type: ActivityType.Playing });

    await bot.application.commands.set([
        {
            name: 'ping',
            description: 'Affiche le ping du bot en ms'
        },
        {
            name: 'setrole',
            description: 'Attribuer un rôle à un utilisateur',
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: "L'utilisateur à qui attribuer le rôle",
                    required: true
                },
                {
                    type: 8,
                    name: 'role',
                    description: 'Le rôle à attribuer',
                    required: true
                }
            ]
        },
        {
            name: 'delrole',
            description: "Retirer un rôle d'un utilisateur",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: "L'utilisateur à qui retirer le rôle",
                    required: true
                },
                {
                    type: 8,
                    name: 'role',
                    description: 'Le rôle à retirer',
                    required: true
                }
            ]
        },
        {
            name: 'clear',
            description: 'Supprimer un certain nombre de messages',
            options: [
                {
                    type: 4,
                    name: 'amount',
                    description: 'Nombre de messages à supprimer',
                    required: true
                }
            ]
        },
        {
            name: 'nuke',
            description: 'Supprimer tous les messages dans le salon'
        },
        {
            name: 'avatar',
            description: "Affiche l'avatar d'un utilisateur",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: "Utilisateur dont vous voulez voir l'avatar",
                    required: false
                }
            ]
        },
        {
            name: 'userinfo',
            description: "Affiche les informations sur un utilisateur",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: "Utilisateur dont vous voulez voir les informations",
                    required: false
                }
            ]
        },
        {
            name: 'statistique',
            description: "Affiche les statistiques d'un utilisateur",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: "Utilisateur dont vous voulez voir les statistiques",
                    required: false
                }
            ]
        },
        {
            name: 'sondage',
            description: 'Créer un sondage',
            options: [
                {
                    type: 3,
                    name: 'question',
                    description: 'Question du sondage',
                    required: true
                },
                {
                    type: 3,
                    name: 'options',
                    description: 'Options séparées par des virgules',
                    required: true
                }
            ]
        },
        {
            name: 'ban',
            description: 'Bannir un utilisateur',
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Utilisateur à bannir',
                    required: true
                },
                {
                    type: 3,
                    name: 'reason',
                    description: 'Raison du bannissement',
                    required: false
                }
            ]
        },
        {
            name: 'exclure',
            description: "Exclure un utilisateur temporairement",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Utilisateur à exclure',
                    required: true
                },
                {
                    type: 4,
                    name: 'time',
                    description: 'Temps en minutes',
                    required: true
                },
                {
                    type: 3,
                    name: 'reason',
                    description: 'Raison',
                    required: false
                }
            ]
        },
        {
            name: 'expulser',
            description: 'Expulser un utilisateur',
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Utilisateur à expulser',
                    required: true
                },
                {
                    type: 3,
                    name: 'reason',
                    description: 'Raison',
                    required: false
                }
            ]
        },
        {
            name: 'dmall',
            description: 'Envoyer un message en MP à tous les membres',
            options: [
                {
                    type: 3,
                    name: 'message',
                    description: 'Message à envoyer',
                    required: true
                }
            ]
        }
    ]);

    console.log('Commandes du bot mises à jour');
});

bot.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    const user = interaction.options.getUser('user');
    const member = user ? interaction.guild.members.cache.get(user.id) : null;
    const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
    const message = interaction.options.getString('message');
    const time = interaction.options.getInteger('time');

    if (commandName === 'ping') {

        const ping = bot.ws.ping;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('#11151c')
                .setTitle('Ping')
                .setDescription(`Ping du bot : ${ping}ms`)
            ]
        });

    }

});
