import type { GuildMember } from "discord.js";
import { env } from "./../../../configs/env";

export default async function removeReactionRole(member: GuildMember, emoji: string): Promise<void> {
  console.log(`[INFO]  : removeReactionRoloe Called`);

  if (!member || !emoji) return;

  if (emoji === "🔔") {
    await member.roles.remove(env.role_id.notifier);
    console.log(`[INFO]  : removeReactionRole <NOTIFIER>`);
    return;
  } else if (emoji === "🔉") {
    await member.roles.remove(env.role_id.vc);
    console.log(`[INFO]  : removeReactionRole <VC>`);
  }
}
