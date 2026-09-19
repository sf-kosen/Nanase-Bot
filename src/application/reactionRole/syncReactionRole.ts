import type { GuildMember } from "discord.js";
import { env } from "../../config/env";
import { type ReactionRoleKind, resolveReactionRole } from "../../domain/reactionRole/reactionRolePolicy";
import { logger } from "../../infrastructure/logger";

type SyncMode = "add" | "remove";

function roleIdOf(kind: ReactionRoleKind): string | undefined {
  return kind === "notifier" ? env.notifierRoleId : env.vcRoleId;
}

async function syncReactionRole(member: GuildMember, emoji: string, mode: SyncMode): Promise<void> {
  const kind = resolveReactionRole(emoji);
  if (!kind) return;

  const roleId = roleIdOf(kind);
  if (!roleId) {
    logger.error(`${kind === "notifier" ? "NOTIFIER_ROLE_ID" : "VC_ROLE_ID"} is not set`);
    return;
  }

  if (mode === "add") {
    await member.roles.add(roleId);
  } else {
    await member.roles.remove(roleId);
  }
  logger.info(`[INFO]  : ${mode}ReactionRole <${kind.toUpperCase()}>`);
}

export { type SyncMode, syncReactionRole };
