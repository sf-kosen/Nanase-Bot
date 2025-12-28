import { CommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../types/command";
import botConfig from "../../bot.config";

export default {
    data: {
        name: "ping",
        flags: MessageFlags.Ephemeral,
        description: "Ping command"
    },
    async execute(interaction: CommandInteraction): Promise<void> {
        const embed = new EmbedBuilder()
            .setTitle("Pong!")
            .setDescription(`WebSocket Ping: ${interaction.client.ws.ping}ms`)
            .setColor(0x00FF00);
        await interaction.followUp({ embeds: [embed], allowedMentions: { roles: [botConfig.role.moderatorId] } });
        return;
    }
} as Command;