import { EmbedBuilder, MessageFlags, ApplicationCommandOptionType, ChatInputCommandInteraction, ChannelType, Colors, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from "discord.js";
import { createButton } from "../libs/button";
import { Command } from "../types/command";
import botConfig from "../../bot.config";
import { ActionRowBuilder } from "discord.js";

// Rate limit: userId -> last ticket creation timestamp
const ticketCooldowns: Map<string, number> = new Map();
const TICKET_COOLDOWN_MS = 60_000; // 60 seconds

export default {
    data: {
        name: "ticket",
        description: "チケットボードを作成します",
        default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
        defer: true,

        options: [
            {
                name: "category",
                description: "チケットを作成するカテゴリーの名前",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "label",
                description: "チケット作成ボタンのラベル",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "title",
                description: "チケット作成ボードのタイトル",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "description",
                description: "チケット作成ボードの説明文",
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.channel;
        const name = interaction.options.getString("category", true);
        const label = interaction.options.getString("label") || "チケットを作成";
        const title = interaction.options.getString("title") || "チケットボード";
        const description = interaction.options.getString("description") || "以下のボタンを押してチケットを作成してください。";

        if (!channel) {
            const embed = new EmbedBuilder()
                .setTitle("エラー")
                .setDescription("このコマンドはチャンネル内で実行してください。")
                .setColor(Colors.Red);

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        // 権限チェック: ManageChannels 権限が必要
        const memberPermissions = interaction.memberPermissions;
        if (!memberPermissions?.has(PermissionFlagsBits.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setTitle("エラー")
                .setDescription("このコマンドを実行するにはチャンネル管理権限が必要です。")
                .setColor(Colors.Red);
            await interaction.followUp({ embeds: [embed] });
            return;
        }

        // レートリミット: 60秒に1回まで
        const userId = interaction.user.id;
        const now = Date.now();
        const lastUsed = ticketCooldowns.get(userId);
        if (lastUsed && now - lastUsed < TICKET_COOLDOWN_MS) {
            const remaining = Math.ceil((TICKET_COOLDOWN_MS - (now - lastUsed)) / 1000);
            const embed = new EmbedBuilder()
                .setTitle("エラー")
                .setDescription(`チケットボードの作成は60秒に1回までです。あと${remaining}秒お待ちください。`)
                .setColor(Colors.Red);
            await interaction.followUp({ embeds: [embed] });
            return;
        }


        try {
            const moderatorId = botConfig.role.moderatorId;
            const moderator = interaction.guild?.roles.cache.get(moderatorId);
            if (!moderator) {
                const embed = new EmbedBuilder()
                    .setTitle("エラー")
                    .setDescription("モデレーターロールが見つかりません。設定を確認してください。")
                    .setColor(Colors.Red);
                await interaction.followUp({ embeds: [embed] });
                return;
            }
            const category = await interaction.guild?.channels.create({
                name,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: moderator,
                        allow: ["ViewChannel", "ManageChannels", "ManageMessages"]
                    }
                ]
            });

            const button = createButton({
                label: label,
                customId: {
                    action: "ticket-open",
                    value: {
                        category: category?.id,
                    }
                },
            });
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(Colors.Aqua);
            const actionRow = new ActionRowBuilder<ButtonBuilder>();
            actionRow.addComponents(button);

            ticketCooldowns.set(userId, Date.now());
            await interaction.followUp({ embeds: [embed], components: [actionRow] });
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle("エラー")
                .setDescription("チケットボードの作成中にエラーが発生しました。")
                .setColor(Colors.Red);

            await interaction.followUp({ embeds: [embed] });
        }

        return;
    }
} as Command;