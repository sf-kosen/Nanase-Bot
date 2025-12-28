import { EmbedBuilder, MessageFlags, ApplicationCommandOptionType, ChatInputCommandInteraction, ChannelType, Colors, ButtonBuilder, ButtonStyle } from "discord.js";
import { createButton } from "../libs/button";
import { Command } from "../types/command";
import botConfig from "../../bot.config";
import { ActionRowBuilder } from "discord.js";

export default {
    data: {
        name: "ticket",
        description: "チケットボードを作成します",
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

        // 認証関連をここに実装。実行できる人は限られる想定

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