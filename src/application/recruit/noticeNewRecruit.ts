import { type Client, EmbedBuilder, type ThreadChannel } from "discord.js";
import botConfig from "../../config/botConfig";
import { logger } from "../../infrastructure/logger";

// biome-ignore lint/suspicious/noExplicitAny: discord.js の send() は複数のペイロード型を受け付けるため
async function sendSafely(
  target: { send: (payload: any) => Promise<unknown> },
  payload: any,
  label: string,
): Promise<void> {
  try {
    await target.send(payload);
  } catch (error) {
    logger.error(`[noticeNewRecruit] Failed to send ${label}:`, error);
  }
}

async function noticeNewRecruit(client: Client, thread: ThreadChannel): Promise<void> {
  const channel = client.channels.cache.get(botConfig.channel.recruitNoticeId);
  if (!channel || !channel.isSendable()) return;

  try {
    const starterMessage = await thread.fetchStarterMessage();
    const owner = await thread.fetchOwner();

    const embed = new EmbedBuilder()
      .setTitle(`${thread.name}　が募集開始したよ！`)
      .setDescription(starterMessage?.content ?? "")
      .addFields(
        { name: "募集開始日時", value: `${thread.createdAt?.toLocaleString()}` },
        { name: "部長候補者", value: owner?.user?.displayName ?? "不明" },
        { name: "参加リンク", value: thread.url },
      )
      .setTimestamp()
      .setColor("#52f525");

    await sendSafely(channel, { embeds: [embed] }, "recruit notice");
    logger.info("[noticeNewRecruit] Successfly sent");
  } catch (error) {
    const embed = new EmbedBuilder().setTitle("エラーが発生しました").setTimestamp().setColor("#ff0000");
    await sendSafely(thread, { embeds: [embed] }, "thread error notice");
    logger.error(error);
    await sendSafely(channel, { embeds: [embed] }, "channel error notice");
  }
}

export { noticeNewRecruit };
