import type { GuildMember } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export default async function addReactionRole(
  member: GuildMember,
  emoji: string,
): Promise<void> {
  const notifierRole = process.env["NOTIFIER_ROLE_ID"]!;
  const VCRole = process.env["VC_ROLE_ID"]!;

if (!member || !emoji) return;

  if (emoji === "bell") {
    await member.roles.add(notifierRole);
  } else if (emoji === "sound") {
    await member.roles.add(VCRole);
  }
}
