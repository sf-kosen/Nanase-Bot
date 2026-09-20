import type { VoiceState } from "discord.js";
import { env } from "../../config/env";
import { shouldDeleteVoiceChannel } from "../../domain/voice/voicePolicy";
import { log, LoggerType } from "../../infrastructure/logger";

async function notifyWebhook(message: string): Promise<void> {
  const webhookUrl = env.webhookUrl?.trim();
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
  } catch (webhookError) {
    log(LoggerType.ERROR, "vc-leave: Webhook送信に失敗しました:", webhookError);
  }
}

export async function cleanupVoiceChannel(oldState: VoiceState, _newState: VoiceState): Promise<void> {
  const channel = oldState.channel;
  if (!channel) return;

  const deletable = shouldDeleteVoiceChannel({
    parentId: channel.parent?.id ?? null,
    channelId: channel.id,
    memberCount: channel.members.size,
  });
  if (!deletable) return;

  log(LoggerType.INFO, `Voice channel ${channel.id} is empty. Deleting...`);

  try {
    await channel.delete();
  } catch (error) {
    log(LoggerType.ERROR, "vc-leave: チャンネル削除に失敗しました:", error);
    await notifyWebhook(`vc-leave: チャンネル削除に失敗しました: ${String(error)}`);
  }
}
