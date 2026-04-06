import type { GuildMember } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const notifierRole = process.env["NOTIFIER_ROLE_ID"]!;
const VCRole = process.env["VC_ROLE_ID"]!;

export default async function removeReactionRole(
  member: GuildMember,
  emoji: string,
): Promise<void> {
if (!member || !emoji) return;

  if (emoji === "bell") {
    await member.roles.remove(notifierRole);
  } else if (emoji === "sound") {
    await member.roles.remove(VCRole);
  }
}
