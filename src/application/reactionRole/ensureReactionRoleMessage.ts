import type { Client } from "discord.js";
import { REACTION_ROLE_MESSAGE } from "../../domain/reactionRole/reactionRolePolicy";
import { log, LoggerType } from "../../infrastructure/logger";
import { botConfig } from "../../config/botConfig";

export default async function ensureReactionRoleMessage(client: Client): Promise<string | null> {
  const channelId = botConfig.channel.reactionRoleId;

  // チャンネルの存在確認
  // TODO: 既存システムにログを書き換え(REACTIONROLE_CHANNEL_IDはbotConfigに移行され、BOT_IDは削除されました)
  if (!channelId || !client.user?.id) {
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
    (m) => m.author.id === client.user?.id && m.content.includes("リアクションしてロールを付与しよう！"),
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
