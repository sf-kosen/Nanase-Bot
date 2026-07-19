import type { Client } from "discord.js";

const REACTION_ROLE_MESSAGE = [
	"リアクションしてロールを付与しよう！",
	"- 🔔 : 通知勢",
	"> たくさん通知が届くよ！",
	"- 🔉 : VC募集",
	"> VCに参加したい人向け！",
].join("\n");

export default async function checkReactionRoleMessage(client: Client): Promise<string | null> {
	const reactionRoleChannelID = process.env["REACTIONROLE_CHANNEL_ID"];
	const botID = process.env["BOT_ID"];

	if (!reactionRoleChannelID || !botID) {
		console.error("REACTIONROLE_CHANNEL_ID or BOT_ID is not set");
		return null;
	}

	const channel = await client.channels.fetch(reactionRoleChannelID);

	if (channel && channel.isTextBased()) {
		if (channel.partial) {
			await channel.fetch();
		}

		if (!("send" in channel)) {
			console.error("Reaction role channel can't send messages");
			return null;
		}

		const messages = await channel.messages.fetch({ limit: 10 });

		const targetMessage = messages.find(
			(m) => m.author.id === botID && m.content.includes("リアクションしてロールを付与しよう！"),
		);

		if (targetMessage) {
			if (targetMessage.content !== REACTION_ROLE_MESSAGE) {
				await targetMessage.edit(REACTION_ROLE_MESSAGE);
			}
			return targetMessage.id;
		}

		const sentMessage = await channel.send(REACTION_ROLE_MESSAGE);
		return sentMessage.id;
	}

	console.error("Reaction role channel is not a text channel");
	return null;
}
