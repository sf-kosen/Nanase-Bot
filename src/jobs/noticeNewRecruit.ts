import { Client, EmbedBuilder, ThreadChannel } from "discord.js";

async function sendSafely(target: { send: (payload: any) => Promise<unknown> }, payload: any, label: string) {
  try {
    await target.send(payload);
  } catch (error) {
    console.error(`[noticeNewRecruit] Failed to send ${label}:`, error);
  }
}

export default async function noticeNewRecruit(
  client: Client,
  thread: ThreadChannel,
) {
  const name = thread.name;

  const channel = client.channels.cache.get("1461005041409327463");
  if (!channel || !channel.isSendable()) return;

  try {
    const startMsg_tmp = await thread.fetchStarterMessage();
    const startMsg = startMsg_tmp!.content;

    const owner_tmp = await thread.fetchOwner();
    const owner = owner_tmp!.user?.displayName!;

    const embed = new EmbedBuilder()
      .setTitle(`${thread.name}　が募集開始したよ！`)
      .setDescription(startMsg)
      .addFields(
        {
          name: "募集開始日時",
          value: `${thread?.createdAt?.toLocaleString()}`,
        },
        {
          name: "部長候補者",
          value: owner,
        },
        {
          name: "参加リンク",
          value: thread.url,
        },
      )
      .setTimestamp()
      .setColor("#52f525");

    await sendSafely(channel, { embeds: [embed] }, "recruit notice");
    console.log("[noticeNewRecruit] Successfly sent");
  } catch (error) {
    const embed = new EmbedBuilder()
      .setTitle("エラーが発生しました")
      .setTimestamp()
      .setColor("#ff0000");
    await sendSafely(thread, { embeds: [embed] }, "thread error notice");

    console.error(error);

    await sendSafely(channel, { embeds: [embed] }, "channel error notice");
    console.log("[noticeNewRecruit] Successfly sent");
  }
}
