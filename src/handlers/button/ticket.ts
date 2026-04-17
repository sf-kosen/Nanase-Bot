/**
 * Ticket button interaction handler
 */
import {
    ButtonInteraction,
    MessageFlags,
    EmbedBuilder,
    Colors,
    ChannelType,
    PermissionFlagsBits,
    type OverwriteResolvable,
} from "discord.js";
import { Action } from "../../types/action";

function createErrorEmbed(description: string) {
    return new EmbedBuilder()
        .setTitle("エラー")
        .setDescription(description)
        .setColor(Colors.Red);
}

export default {
    data: {
        action: "ticket-open",
        flags: MessageFlags.Ephemeral,
        defer: true,
    },

    async execute(interaction: ButtonInteraction) {
        const guild = interaction.guild;
        const targetUser = interaction.user;

        if (!guild) {
            await interaction.followUp({
                embeds: [createErrorEmbed("サーバー情報を取得できませんでした。")],
                ephemeral: true,
            });
            return;
        }

        let categoryId: string | undefined;
        try {
            const customId = JSON.parse(interaction.customId);
            const rawCategory = customId?.value?.category;
            categoryId =
                typeof rawCategory === "string"
                    ? rawCategory
                    : typeof rawCategory?.category === "string"
                      ? rawCategory.category
                      : undefined;
        } catch {
            await interaction.followUp({
                embeds: [createErrorEmbed("ボタンの情報を正しく読み取れませんでした。")],
                ephemeral: true,
            });
            return;
        }

        if (typeof categoryId !== "string" || categoryId.length === 0) {
            await interaction.followUp({
                embeds: [createErrorEmbed("カテゴリー情報が不正です。")],
                ephemeral: true,
            });
            return;
        }

        const category = guild.channels.cache.get(categoryId);
        if (!category || category.type !== ChannelType.GuildCategory) {
            await interaction.followUp({
                embeds: [createErrorEmbed("指定されたカテゴリーが見つからないか、カテゴリーではありません。")],
                ephemeral: true,
            });
            return;
        }

        const ticketChannelName = `ticket-${targetUser.id}`;
        const existingTicket = guild.channels.cache.find(
            (channel) =>
                channel.parentId === category.id &&
                channel.name === ticketChannelName,
        );

        if (existingTicket) {
            const embed = new EmbedBuilder()
                .setTitle("既存のチケットがあります")
                .setDescription(`すでにチケットチャンネル ${existingTicket} があります。`)
                .setColor(Colors.Yellow);

            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        try {
            const permissionOverwrites: OverwriteResolvable[] = [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: targetUser.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                    ],
                },
            ];

            if (guild.members.me) {
                permissionOverwrites.push({
                    id: guild.members.me.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageChannels,
                    ],
                });
            }

            const ticketChannel = await guild.channels.create({
                name: ticketChannelName,
                type: ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites,
            });

            const embed = new EmbedBuilder()
                .setTitle("チケットが作成されました")
                .setDescription(`チケットチャンネル ${ticketChannel} が作成されました。`)
                .setColor(Colors.Green);
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.followUp({
                embeds: [createErrorEmbed("チケットチャンネルの作成中にエラーが発生しました。")],
                ephemeral: true,
            });
        }
    }
} as Action<ButtonInteraction>;
