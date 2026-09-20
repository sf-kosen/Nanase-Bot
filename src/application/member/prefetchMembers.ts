import type { Client } from "discord.js";
import botConfig from "../../config/botConfig";
import { log, LoggerType } from "../../infrastructure/logger";

// 起動時にギルドメンバーをキャッシュへ読み込む。
async function prefetchMembers(client: Client): Promise<void> {
  log(LoggerType.INFO, "Starting member prefetch...");
  const guild = await client.guilds.fetch(botConfig.guild.id);
  await guild.members.fetch();
  log(LoggerType.INFO, "Member prefetch completed");
}

export { prefetchMembers };
