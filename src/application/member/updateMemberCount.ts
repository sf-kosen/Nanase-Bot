import type { Client } from "discord.js";
import botConfig from "../../config/botConfig";
import { memberCountLabel, STUDENT_ROLE_ID } from "../../domain/member/memberPolicy";
import { logger } from "../../infrastructure/logger";

async function updateMemberCount(client: Client): Promise<void> {
  logger.info("[INFO]  Updating member count...");

  try {
    const guild = client.guilds.cache.get(botConfig.guild.id);
    if (!guild) {
      logger.error("[ERROR] Guild not found");
      return;
    }

    const channel = guild.channels.cache.get(botConfig.channel.memberCountId);
    if (!channel || !channel.isTextBased()) {
      logger.error("[ERROR] Channel not found or not a text channel");
      return;
    }

    const roleMemberCounts = await guild.roles.fetchMemberCounts();
    const memberCount = roleMemberCounts.get(STUDENT_ROLE_ID);
    if (memberCount === undefined) {
      logger.error("[ERROR] Student role count not found");
      return;
    }

    await channel.setName(memberCountLabel(memberCount));
    logger.info(`[INFO]  Updated member count in ${channel.name}`);
  } catch (error) {
    logger.error(`[ERROR] Updating member count: ${error}`);
  }
}

export { updateMemberCount };
