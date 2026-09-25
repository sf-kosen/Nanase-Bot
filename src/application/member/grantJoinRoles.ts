import type { GuildMember } from "discord.js";
import { botConfig } from "../../config/botConfig";
import { log, LoggerType } from "../../infrastructure/logger";

async function addRoleSafely(member: GuildMember, roleId: string, label: string): Promise<void> {
  try {
    await member.roles.add(roleId);
  } catch (error) {
    log(LoggerType.ERROR, `Failed to add ${label} role (${roleId}):`, error);
  }
}

// 参加メンバーへ初期ロールを付与する。
export async function grantJoinRoles(member: GuildMember): Promise<void> {
  if (member.user.bot) {
    await addRoleSafely(member, botConfig.role.botId, "bot");
    await addRoleSafely(member, botConfig.role.botId, "student");
  }

  await addRoleSafely(member, botConfig.role.yearId, "2026 student");
}
