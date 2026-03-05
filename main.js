const { Client, PermissionsBitField, ActivityType, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const bot = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers'] });
let welcomeConfig = {};

// Charger le fichier JSON au démarrage du bot
if (fs.existsSync('./welcome.json')) {
    welcomeConfig = JSON.parse(fs.readFileSync('./welcome.json', 'utf8'));
}

bot.login("MTI4MDUzNTkxNzQ4ODI0Mjc2MA.Gyx_zc.pWYEd8Rrc_pvWBrhmWTHnKlDZpPRTK8y-mF3XU")
    .then(() => console.log('Connecté au bot !'))
    .catch(error => console.log('Connexion impossible : ' + error));

bot.on('ready', async () => {
    bot.user.setActivity('Bot by 916789', { type: ActivityType.Playing });

    // Définir les commandes du bot
    await bot.application.commands.set([
        {
            name: 'setwelcome',
            description: 'Définir le salon pour le message de bienvenue',
            options: [
                {
                    type: 7,
                    name: 'channel',
                    description: 'Salon où envoyer le message de bienvenue',
                    required: true
                }
            ]
        },
        {
            name: 'ping',
            description: 'Répond avec le ping du bot'
        },
        {
            name: 'clear',
            description: 'Supprimer un nombre de messages',
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
            description: 'Vider le salon'
        },
        {
            name: 'avatar',
            description: 'Afficher l\'avatar d\'un utilisateur',
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Utilisateur dont afficher l\'avatar',
                    required: false
                }
            ]
        },
        {
            name: 'userinfo',
            description: 'Afficher les informations d\'un utilisateur',
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Utilisateur dont afficher les informations',
                    required: false
                }
            ]
        },
        {
            name: 'statistique',
            description: 'Afficher les statistiques d\'un utilisateur',
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Utilisateur dont afficher les statistiques',
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
                    description: 'Options du sondage séparées par des virgules',
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
            description: 'Exclure un utilisateur pour une durée déterminée',
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
                    description: 'Durée de l\'exclusion en minutes',
                    required: true
                },
                {
                    type: 3,
                    name: 'reason',
                    description: 'Raison de l\'exclusion',
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
                    description: 'Raison de l\'expulsion',
                    required: false
                }
            ]
        },
        {
            name: 'role',
            description: 'Attribuer ou retirer un rôle',
            options: [
                {
                    type: 1,
                    name: 'assign',
                    description: 'Attribuer un rôle',
                    options: [
                        {
                            type: 6,
                            name: 'user',
                            description: 'Utilisateur',
                            required: true
                        },
                        {
                            type: 8,
                            name: 'role',
                            description: 'Rôle',
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'remove',
                    description: 'Retirer un rôle',
                    options: [
                        {
                            type: 6,
                            name: 'user',
                            description: 'Utilisateur',
                            required: true
                        },
                        {
                            type: 8,
                            name: 'role',
                            description: 'Rôle',
                            required: true
                        }
                    ]
                }
            ]
        }
    ]);

    console.log('Les commandes ont été mises à jour !');
});

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'setwelcome') {
        const channel = interaction.options.getChannel('channel');
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de définir le salon pour le message de bienvenue.", ephemeral: true });
        }

        welcomeConfig[interaction.guild.id] = { channelId: channel.id };
        fs.writeFileSync('./welcome.json', JSON.stringify(welcomeConfig, null, 4), 'utf8');

        await interaction.reply({ content: `Salon pour le message de bienvenue défini pour le salon <#${channel.id}> !`, ephemeral: true });
    } else if (commandName === 'ping') {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setTitle('Ping').setDescription(`Ping du bot : ${bot.ws.ping}ms`)] });
    } else if (commandName === 'clear') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.')], ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');
        if (amount > 100 || amount < 1) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Le nombre de messages doit être compris entre 1 et 100.')], ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setDescription(`J'ai supprimé ${amount} messages.`)], ephemeral: true });
    } else if (commandName === 'nuke') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.')], ephemeral: true });
        }

        const messages = await interaction.channel.messages.fetch();
        await interaction.channel.bulkDelete(messages);
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setDescription('Le salon a été vidé avec succès.')], ephemeral: true });
    } else if (commandName === 'avatar') {
        const user = interaction.options.getUser('user') || interaction.user;
        const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setTitle(`Avatar de ${user.tag}`).setImage(avatarURL)] });
    } else if (commandName === 'userinfo') {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const embed = new EmbedBuilder()
            .setColor('#11151c')
            .setTitle(`Informations sur ${user.tag}`)
            .addFields(
                { name: 'ID', value: user.id, inline: true },
                { name: 'Pseudo', value: user.username, inline: true },
                { name: 'Tag', value: user.discriminator, inline: true },
                { name: 'Date d\'inscription', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
                { name: 'Date d\'arrivée', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'Non disponible', inline: true }
            );
        await interaction.reply({ embeds: [embed] });
    } else if (commandName === 'statistique') {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const embed = new EmbedBuilder()
            .setColor('#11151c')
            .setTitle(`Statistiques pour ${user.tag}`)
            .addFields(
                { name: 'Messages envoyés', value: 'Statistique non disponible', inline: true },
                { name: 'Roles', value: member ? member.roles.cache.map(role => role.name).join(', ') : 'Non disponible', inline: true }
            );
        await interaction.reply({ embeds: [embed] });
    } else if (commandName === 'sondage') {
        const question = interaction.options.getString('question');
        const options = interaction.options.getString('options').split(',').map(opt => opt.trim());

        if (options.length < 2 || options.length > 10) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Vous devez fournir entre 2 et 10 options.')], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#11151c')
            .setTitle('Sondage')
            .setDescription(question)
            .addFields(options.map((option, index) => ({ name: `${index + 1}. ${option}`, value: '\u200b', inline: true })));

        const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(reactions[i]);
        }
    } else if (commandName === 'ban') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.')], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
        if (!user) return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Utilisateur non spécifié.')], ephemeral: true });

        const member = interaction.guild.members.cache.get(user.id);
        if (member) {
            try {
                await member.ban({ reason });
                await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setDescription(`Utilisateur ${user.tag} banni avec succès.`)] });
            } catch (error) {
                await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Erreur lors du bannissement de l\'utilisateur.')], ephemeral: true });
            }
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('L\'utilisateur spécifié n\'est pas dans le serveur.')], ephemeral: true });
        }
    } else if (commandName === 'exclure') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.')], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const time = interaction.options.getInteger('time');
        const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
        if (!user) return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Utilisateur non spécifié.')], ephemeral: true });

        const member = interaction.guild.members.cache.get(user.id);
        if (member) {
            try {
                await member.timeout(time * 60000, reason);
                await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setDescription(`Utilisateur ${user.tag} exclu pour ${time} minutes.`)] });
            } catch (error) {
                await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Erreur lors de l\'exclusion de l\'utilisateur.')], ephemeral: true });
            }
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('L\'utilisateur spécifié n\'est pas dans le serveur.')], ephemeral: true });
        }
    } else if (commandName === 'expulser') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.')], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
        if (!user) return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Utilisateur non spécifié.')], ephemeral: true });

        const member = interaction.guild.members.cache.get(user.id);
        if (member) {
            try {
                await member.kick(reason);
                await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setDescription(`Utilisateur ${user.tag} expulsé avec succès.`)] });
            } catch (error) {
                await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Erreur lors de l\'expulsion de l\'utilisateur.')], ephemeral: true });
            }
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('L\'utilisateur spécifié n\'est pas dans le serveur.')], ephemeral: true });
        }
    } else if (commandName === 'role') {
        const subcommand = interaction.options.getSubcommand();
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.')], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const member = interaction.guild.members.cache.get(user.id);

        if (member) {
            try {
                if (subcommand === 'assign') {
                    await member.roles.add(role);
                    await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setDescription(`Le rôle ${role.name} a été attribué à ${user.tag} avec succès.`)] });
                } else if (subcommand === 'remove') {
                    await member.roles.remove(role);
                    await interaction.reply({ embeds: [new EmbedBuilder().setColor('#11151c').setDescription(`Le rôle ${role.name} a été retiré de ${user.tag} avec succès.`)] });
                }
            } catch (error) {
                await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('Erreur lors de la gestion du rôle.')], ephemeral: true });
            }
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('L\'utilisateur spécifié n\'est pas dans le serveur.')], ephemeral: true });
        }
    }
});

bot.on('guildMemberAdd', async member => {
    const guildConfig = welcomeConfig[member.guild.id];
    if (guildConfig) {
        const welcomeChannel = member.guild.channels.cache.get(guildConfig.channelId);
        if (welcomeChannel) {
            await welcomeChannel.send(`<@${member.id}>`);

            const embed = new EmbedBuilder()
                .setColor('#11151c')
                .setTitle('Ho ! Un nouveau membre !')
                .setDescription(`🎉Bienvenue <@${member.id}> sur **${member.guild.name}**🎉 !`)
                .setThumbnail(member.user.displayAvatarURL({ format: 'png', size: 128 }))
                .setTimestamp();
            await welcomeChannel.send({ embeds: [embed] });
        }
    }
});
