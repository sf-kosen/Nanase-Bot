import type { GuildMember } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export default async function removeReactionRole(member: GuildMember, emoji: string): Promise<void> {
	const notifierRole = process.env["NOTIFIER_ROLE_ID"];
	const VCRole = process.env["VC_ROLE_ID"];

	console.log(`[INFO]  : removeReactionRoloe Called`);

	if (!member || !emoji) return;

	if (emoji === "🔔") {
		if (!notifierRole) {
			console.error("NOTIFIER_ROLE_ID is not set");
			return;
		}

		await member.roles.remove(notifierRole);
		console.log(`[INFO]  : removeReactionRole <NOTIFIER>`);
		return;
	} else if (emoji === "🔉") {
		if (!VCRole) {
			console.error("VC_ROLE_ID is not set");
			return;
		}

		await member.roles.remove(VCRole);
		console.log(`[INFO]  : removeReactionRole <VC>`);
	}
}
