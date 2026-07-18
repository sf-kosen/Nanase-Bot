import type { GuildMember } from "discord.js";
import { env } from "../../configs/env";

export default async function addReactionRole(
  member: GuildMember,
  emoji: string,
): Promise<void> {
  console.log(`[INFO]  : addReactionRole Called`);

  if (!member || !emoji) return;

  if (emoji === "🔔") {
    if (!env.role_id.notifier) {
      console.error("NOTIFIER_ROLE_ID is not set");
      return;
    }

    await member.roles.add(env.role_id.notifier);
    console.log(`[INFO]  : addReactionRole <NOTIFIER>}`);
    return;
  } else if (emoji === "🔉") {
    if (!env.role_id.vc) {
      console.error("VC_ROLE_ID is not set");
      return;
    }

    await member.roles.add(env.role_id.vc);
    console.log(`[INFO]  : addReactionRole <VC>`);
  }
}
