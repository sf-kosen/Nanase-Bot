import type { Client } from "discord.js";
import botConfig from "../../config/botConfig";
import { memberCountLabel, STUDENT_ROLE_ID } from "../../domain/member/memberPolicy";
import { log, LoggerType } from "../../infrastructure/logger";

async function updateMemberCount(client: Client): Promise<void> {
  log(LoggerType.INFO, "Updating member count...");

  try {
    const guild = client.guilds.cache.get(botConfig.guild.id);
    if (!guild) {
      log(LoggerType.ERROR, "Guild not found");
      return;
    }

    const channel = guild.channels.cache.get(botConfig.channel.memberCountId);
    if (!channel || !channel.isTextBased()) {
      log(LoggerType.ERROR, "Channel not found or not a text channel");
      return;
    }

    const roleMemberCounts = await guild.roles.fetchMemberCounts();
    const memberCount = roleMemberCounts.get(STUDENT_ROLE_ID);
    if (memberCount === undefined) {
      log(LoggerType.ERROR, "Student role count not found");
      return;
    }

    await channel.setName(memberCountLabel(memberCount));
    log(LoggerType.INFO, `Updated member count in ${channel.name}`);
  } catch (error) {
    log(LoggerType.ERROR, `Updating member count: ${error}`);
  }
}

export { updateMemberCount };
