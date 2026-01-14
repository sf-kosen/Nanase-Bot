import { Client, EmbedBuilder, ThreadChannel } from "discord.js";

export default async function noticeNewRecruit(
  client: Client,
  thread: ThreadChannel,
) {
  const name = thread.name;

  const channel = client.channels.cache.get("1453750689393283143");
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

    await channel.send({ embeds: [embed] });
    console.log("[noticeNewRecruit] Successfly sent");
  } catch (error) {
    const embed = new EmbedBuilder()
      .setTitle("エラーが発生しました")
      .setTimestamp()
      .setColor("#ff0000");
    await thread.send({ embeds: [embed] });

    console.error(error);

    await channel.send({ embeds: [embed] });
    console.log("[noticeNewRecruit] Successfly sent");
  }
}
