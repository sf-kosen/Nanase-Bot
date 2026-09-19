import type { Client } from "discord.js";
import botConfig from "../../config/botConfig";
import { logger } from "../../infrastructure/logger";

// 起動時にギルドメンバーをキャッシュへ読み込む。
async function prefetchMembers(client: Client): Promise<void> {
  logger.info("[INFO] Starting member prefetch...");
  const guild = await client.guilds.fetch(botConfig.guild.id);
  await guild.members.fetch();
  logger.info("[INFO] Member prefetch completed");
}

export { prefetchMembers };
