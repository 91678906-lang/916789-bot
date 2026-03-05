const { Client, PermissionsBitField, ActivityType, EmbedBuilder } = require('discord.js');

const bot = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers'] });
console.log('Connexion au bot ....');

bot.login('MTI4MDUzNTkxNzQ4ODI0Mjc2MA.Gyx_zc.pWYEd8Rrc_pvWBrhmWTHnKlDZpPRTK8y-mF3XU') // Remplacez par votre vrai token
    .then(() => console.log('Connecté au bot !'))
    .catch(error => console.log('Connexion impossible : ' + error));

bot.on('ready', async () => {
    bot.user.setActivity('Bot by 916789', { type: ActivityType.Playing });

    await bot.application.commands.set([
        // Vos autres commandes
        {
            name: 'ping',
            description: 'Affiche le ping du bot en ms'
        },
        {
            name: 'setrole',
            description: 'Attribuer un rôle à un utilisateur',
            options: [
                {
                    type: 6, // Type USER pour mentionner un utilisateur
                    name: 'user',
                    description: 'L\'utilisateur à qui attribuer le rôle',
                    required: true
                },
                {
                    type: 8, // Type ROLE pour choisir un rôle
                    name: 'role',
                    description: 'Le rôle à attribuer',
                    required: true
                }
            ]
        },
        {
            name: 'delrole',
            description: 'Retirer un rôle d\'un utilisateur',
            options: [
                {
                    type: 6, // Type USER pour mentionner un utilisateur
                    name: 'user',
                    description: 'L\'utilisateur à qui retirer le rôle',
                    required: true
                },
                {
                    type: 8, // Type ROLE pour choisir un rôle
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
                    type: 4, // Type INTEGER pour spécifier le nombre de messages
                    name: 'amount',
                    description: 'Le nombre de messages à supprimer',
                    required: true
                }
            ]
        },
        {
            name: 'nuke',
            description: 'Supprimer tous les messages dans le salon',
        },
        {
            name: 'avatar',
            description: 'Affiche l\'avatar d\'un utilisateur',
            options: [
                {
                    type: 6, // Type USER pour mentionner un utilisateur
                    name: 'user',
                    description: 'L\'utilisateur dont vous voulez voir l\'avatar',
                    required: false
                }
            ]
        },
        {
            name: 'userinfo',
            description: 'Affiche les informations sur un utilisateur',
            options: [
                {
                    type: 6, // Type USER pour mentionner un utilisateur
                    name: 'user',
                    description: 'L\'utilisateur dont vous voulez voir les informations',
                    required: false
                }
            ]
        },
        {
            name: 'statistique',
            description: 'Affiche les statistiques d\'un utilisateur',
            options: [
                {
                    type: 6, // Type USER pour mentionner un utilisateur
                    name: 'user',
                    description: 'L\'utilisateur dont vous voulez voir les statistiques',
                    required: false
                }
            ]
        },
        {
            name: 'sondage',
            description: 'Crée un sondage',
            options: [
                {
                    type: 3, // Type STRING pour la question du sondage
                    name: 'question',
                    description: 'La question du sondage',
                    required: true
                },
                {
                    type: 3, // Type STRING pour les options (séparées par des virgules)
                    name: 'options',
                    description: 'Les options du sondage, séparées par des virgules',
                    required: true
                }
            ]
        },
        {
            name: 'ban',
            description: 'Bannir un utilisateur',
            options: [
                {
                    type: 6, // Type USER pour mentionner un utilisateur
                    name: 'user',
                    description: 'L\'utilisateur à bannir',
                    required: true
                },
                {
                    type: 3, // Type STRING pour la raison
                    name: 'reason',
                    description: 'La raison du bannissement',
                    required: false
                }
            ]
        },
        {
            name: 'exclure',
            description: 'Exclure un utilisateur pour un certain temps',
            options: [
                {
                    type: 6, // Type USER pour mentionner un utilisateur
                    name: 'user',
                    description: 'L\'utilisateur à exclure',
                    required: true
                },
                {
                    type: 4, // Type INTEGER pour le temps en minutes
                    name: 'time',
                    description: 'Le temps d\'exclusion en minutes',
                    required: true
                },
                {
                    type: 3, // Type STRING pour la raison
                    name: 'reason',
                    description: 'La raison de l\'exclusion',
                    required: false
                }
            ]
        },
        {
            name: 'expulser',
            description: 'Expulser un utilisateur',
            options: [
                {
                    type: 6, // Type USER pour mentionner un utilisateur
                    name: 'user',
                    description: 'L\'utilisateur à expulser',
                    required: true
                },
                {
                    type: 3, // Type STRING pour la raison',
                    name: 'reason',
                    description: 'La raison de l\'expulsion',
                    required: false
                }
            ]
        },
        {
            name: 'dmall',
            description: 'Envoyer un message en MP à tous les membres du serveur',
            options: [
                {
                    type: 3, // Type STRING pour le message à envoyer
                    name: 'message',
                    description: 'Le message à envoyer en MP à tous les membres',
                    required: true
                }
            ]
        }
    ]);

    console.log('Les commandes du bot ont été mises à jour !');
});

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    // Vérification pour le rôle des membres et les permissions
    const user = interaction.options.getUser('user');
    const member = user ? interaction.guild.members.cache.get(user.id) : null;
    const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
    const message = interaction.options.getString('message');
    const time = interaction.options.getInteger('time');

    if (commandName === 'ping') {
        const ping = bot.ws.ping;
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('#11151c')
                .setTitle('Ping')
                .setDescription(`Ping du bot : ${ping}ms`)
            ]
        });
    }
    else if (commandName === 'setrole' || commandName === 'delrole') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")
                ],
                ephemeral: true
            });
        }

        if (commandName === 'setrole') {
            const role = interaction.options.getRole('role');
            if (!role) {
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription('Le rôle spécifié n\'existe pas !')
                    ],
                    ephemeral: true
                });
            }
            if (member && !member.roles.cache.has(role.id)) {
                await member.roles.add(role);
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('#11151c')
                        .setDescription(`Le rôle ${role.name} a été attribué à ${user.tag} avec succès.`)
                    ]
                });
            } else {
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('#FFFF00')
                        .setDescription(`L'utilisateur ${user.tag} a déjà le rôle ${role.name}.`)
                    ]
                });
            }
        }
        else if (commandName === 'delrole') {
            const role = interaction.options.getRole('role');
            if (!role) {
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription('Le rôle spécifié n\'existe pas !')
                    ],
                    ephemeral: true
                });
            }
            if (member && member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('#11151c')
                        .setDescription(`Le rôle ${role.name} a été retiré de ${user.tag} avec succès.`)
                    ]
                });
            } else {
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('#FFFF00')
                        .setDescription(`L'utilisateur ${user.tag} n'a pas le rôle ${role.name}.`)
                    ]
                });
            }
        }
    }
    else if (commandName === 'clear') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")
                ],
                ephemeral: true
            });
        }

        const amount = interaction.options.getInteger('amount');
        if (!amount || amount < 1) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous devez spécifier un nombre valide de messages à supprimer.")
                ],
                ephemeral: true
            });
        }

        try {
            await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#11151c')
                    .setDescription(`${amount} messages ont été supprimés.`)
                ]
            });
        } catch (error) {
            console.error('Erreur lors de la suppression des messages :', error);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('Une erreur est survenue lors de la suppression des messages.')
                ],
                ephemeral: true
            });
        }
    }
    else if (commandName === 'nuke') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")
                ],
                ephemeral: true
            });
        }

        try {
            const clonedChannel = await interaction.channel.clone();
            await interaction.channel.delete();

            await clonedChannel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('Le salon a été nuked !')
                ]
            });
        } catch (error) {
            console.error('Erreur lors du nuke du salon :', error);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('Une erreur est survenue lors du nuke du salon.')
                ],
                ephemeral: true
            });
        }
    }
    else if (commandName === 'avatar') {
        const user = interaction.options.getUser('user') || interaction.user;
        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('#11151c')
                .setTitle(`Avatar de ${user.username}`)
                .setImage(avatarUrl)
            ]
        });
    }
    else if (commandName === 'userinfo') {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const embed = new EmbedBuilder()
            .setColor('#11151c')
            .setTitle(`Informations de ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: 'Tag', value: user.tag, inline: true },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Surnom', value: member.nickname || 'Aucun', inline: true },
                { name: 'Compte créé le', value: user.createdAt.toDateString(), inline: true },
                { name: 'A rejoint le serveur le', value: member.joinedAt.toDateString(), inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    }
    else if (commandName === 'statistique') {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const roles = member.roles.cache.map(role => role.name).join(', ');
        const embed = new EmbedBuilder()
            .setColor('#11151c')
            .setTitle(`Statistiques de ${user.username}`)
            .addFields(
                { name: 'Rôles', value: roles || 'Aucun rôle', inline: true },
                { name: 'Nombre de messages', value: 'Fonctionnalité à implémenter', inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    }
    else if (commandName === 'sondage') {
        const question = interaction.options.getString('question');
        const optionsString = interaction.options.getString('options');
        const optionsArray = optionsString.split(',').map(opt => opt.trim());

        if (optionsArray.length < 2 || optionsArray.length > 10) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('Vous devez fournir entre 2 et 10 options pour le sondage.')
                ],
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#11151c')
            .setTitle(question)
            .setDescription(optionsArray.map((opt, index) => `:${['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten'][index]}: ${opt}`).join('\n'));

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        for (let i = 0; i < optionsArray.length; i++) {
            await message.react(reactions[i]);
        }
    }
    else if (commandName === 'ban') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")
                ],
                ephemeral: true
            });
        }

        if (member) {
            await member.ban({ reason });
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#11151c')
                    .setDescription(`L'utilisateur ${user.tag} a été banni pour la raison suivante : ${reason}.`)
                ]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Impossible de trouver l'utilisateur.")
                ],
                ephemeral: true
            });
        }
    }
    else if (commandName === 'exclure') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")
                ],
                ephemeral: true
            });
        }

        if (member) {
            await member.timeout(time * 60 * 1000, reason);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#11151c')
                    .setDescription(`L'utilisateur ${user.tag} a été exclu pour ${time} minutes pour la raison suivante : ${reason}.`)
                ]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Impossible de trouver l'utilisateur.")
                ],
                ephemeral: true
            });
        }
    }
    else if (commandName === 'expulser') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")
                ],
                ephemeral: true
            });
        }

        if (member) {
            await member.kick(reason);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#11151c')
                    .setDescription(`L'utilisateur ${user.tag} a été expulsé pour la raison suivante : ${reason}.`)
                ]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Impossible de trouver l'utilisateur.")
                ],
                ephemeral: true
            });
        }
    }
     else if (commandName === 'dmall') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")
                ],
                ephemeral: true
            });
        }
        if (!message) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("Vous devez spécifier un message à envoyer.")
                ],
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#11151c')
            .setTitle('Message du serveur')
            .setDescription(message);

        const members = interaction.guild.members.cache.filter(m => !m.user.bot);

        for (const [id, member] of members) {
            try {
                await member.send({ embeds: [embed] });
            } catch (error) {
                console.error(`Impossible d'envoyer un message à ${member.user.tag}:`, error);
            }
        }

        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('#11151c')
                .setDescription('Le message a été envoyé à tous les membres du serveur.')
            ]
        });
    }
});
