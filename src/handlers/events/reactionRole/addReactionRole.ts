import { GuildMember } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const notifierRole = process.env["NOTIFIER_ROLE"]!;
const VCRole = process.env["VCRole"]!;

export default async function addReactionRole(
  member: GuildMember,
  emoji: String,
): Promise<void> {
  if (!member) return;
  if (!emoji) return;

  if (emoji === "bell") {
    await member.roles.add(notifierRole);
  } else if (emoji === "sound") {
    await member.roles.add(VCRole);
  }
}
