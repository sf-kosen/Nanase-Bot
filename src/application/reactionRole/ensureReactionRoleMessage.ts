import type { Client } from "discord.js";
import { env } from "../../config/env";
import { REACTION_ROLE_MESSAGE } from "../../domain/reactionRole/reactionRolePolicy";
import { log, LoggerType } from "../../infrastructure/logger";

export default async function ensureReactionRoleMessage(client: Client): Promise<string | null> {
  const channelId = env.reactionRoleChannelId;
  const botId = env.botId;

  if (!channelId || !botId) {
    log(LoggerType.ERROR, "REACTIONROLE_CHANNEL_ID or BOT_ID is not set");
    return null;
  }

  const channel = await client.channels.fetch(channelId);

  if (!channel?.isTextBased()) {
    log(LoggerType.ERROR, "Reaction role channel is not a text channel");
    return null;
  }

  if (channel.partial) await channel.fetch();
  if (!("send" in channel)) {
    log(LoggerType.ERROR, "Reaction role channel can't send messages");
    return null;
  }

  const messages = await channel.messages.fetch({ limit: 10 });
  const targetMessage = messages.find(
    (m) => m.author.id === botId && m.content.includes("リアクションしてロールを付与しよう！"),
  );

  if (targetMessage) {
    if (targetMessage.content !== REACTION_ROLE_MESSAGE) {
      await targetMessage.edit(REACTION_ROLE_MESSAGE);
    }
    return targetMessage.id;
  }

  const sentMessage = await channel.send(REACTION_ROLE_MESSAGE);
  return sentMessage.id;
}
