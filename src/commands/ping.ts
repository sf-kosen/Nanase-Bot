import { type CommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import botConfig from "../../bot.config";
import type { Command } from "../types/command";

export default {
	data: {
		name: "ping",
		flags: MessageFlags.Ephemeral,
		description: "Ping command",
	},
	async execute(interaction: CommandInteraction): Promise<void> {
		const embed = new EmbedBuilder()
			.setTitle("Pong!")
			.setDescription(`WebSocket Ping: ${interaction.client.ws.ping}ms`)
			.setColor(0x00ff00);
		await interaction.followUp({ embeds: [embed], allowedMentions: { roles: [botConfig.role.moderatorId] } });
		return;
	},
} as Command;
