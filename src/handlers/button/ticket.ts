/**
 * Ticket button interaction handler
 */
import { ButtonInteraction, MessageFlags, EmbedBuilder, Colors } from "discord.js";
import { Action } from "../../types/action";

module.exports = {
    data: {
        action: "ticket",
        flags: MessageFlags.Ephemeral
    },

    async execute(interaction: ButtonInteraction) {
        const targetUser = interaction.user;
        const customId = JSON.parse(interaction.customId);
        const categoryId = customId.value.category;

        const category = interaction.guild?.channels.cache.get(categoryId.category);
        if (!category || category.type !== 4) {
            const embed = new EmbedBuilder()
                .setTitle("エラー")
                .setDescription("指定されたカテゴリーが見つからないか、カテゴリーではありません。")
                .setColor(Colors.Red);

            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        try {
            const ticketChannel = await interaction.guild?.channels.create({
                name: `ticket-${targetUser.username}`,
                type: 0,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: targetUser.id,
                        allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                    }
                ]
            });
            const embed = new EmbedBuilder()
                .setTitle("チケットが作成されました")
                .setDescription(`チケットチャンネル ${ticketChannel} が作成されました。`)
                .setColor(Colors.Green);
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle("エラー")
                .setDescription("チケットチャンネルの作成中にエラーが発生しました。")
                .setColor(Colors.Red);
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
} as Action<ButtonInteraction>;