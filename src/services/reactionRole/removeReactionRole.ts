import type { GuildMember } from "discord.js";
import { env } from "../../configs/env";

export default async function removeReactionRole(
  member: GuildMember,
  emoji: string,
): Promise<void> {
  console.log(`[INFO]  : removeReactionRoloe Called`);

  if (!member || !emoji) return;

  if (emoji === "🔔") {
    if (!env.role_id.notifier) {
      console.error("NOTIFIER_ROLE_ID is not set");
      return;
    }

    await member.roles.remove(env.role_id.notifier);
    console.log(`[INFO]  : removeReactionRole <NOTIFIER>`);
    return;
  } else if (emoji === "🔉") {
    if (!env.role_id.vc) {
      console.error("VC_ROLE_ID is not set");
      return;
    }

    await member.roles.remove(env.role_id.vc);
    console.log(`[INFO]  : removeReactionRole <VC>`);
  }
}
