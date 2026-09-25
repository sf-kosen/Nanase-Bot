import type { GuildMember } from "discord.js";
import { type ReactionRoleKind, resolveReactionRole } from "../../domain/reactionRole/reactionRolePolicy";
import { log, LoggerType } from "../../infrastructure/logger";
import { botConfig } from "../../config/botConfig";

export type SyncMode = "add" | "remove";

function roleIdOf(kind: ReactionRoleKind): string | undefined {
  return kind === "notifier" ? botConfig.role.notifierId : botConfig.role.vcJoinId;
}

export default async function syncReactionRole(member: GuildMember, emoji: string, mode: SyncMode): Promise<void> {
  const kind = resolveReactionRole(emoji);
  if (!kind) return;

  const roleId = roleIdOf(kind);
  if (!roleId) {
    log(LoggerType.ERROR, `${kind === "notifier" ? "NOTIFIER_ROLE_ID" : "VC_ROLE_ID"} is not set`);
    return;
  }

  if (mode === "add") {
    await member.roles.add(roleId);
  } else {
    await member.roles.remove(roleId);
  }
  log(LoggerType.INFO, ` : ${mode}ReactionRole <${kind.toUpperCase()}>`);
}
