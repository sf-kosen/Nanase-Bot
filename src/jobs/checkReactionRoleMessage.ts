import { Client } from "discord.js";

const reactionRoleChannelID = process.env["REACTIONROLE_CHANNELID"]!;
const botID = process.env["BOT_ID"]!;

export default async function checkReactionRoleMessage(
  client: Client,
): Promise<string | null> {
  const channel = await client.channels.fetch(reactionRoleChannelID);

  if (channel && channel.isTextBased()) {
    if (channel.partial) {
      await channel.fetch();
    }

    const messages = await channel.messages.fetch({ limit: 10 });

    const targetMessage = messages.find((m) => {
      m.author.id === botID && m.content.includes("ロールを付与");
    });

    if (targetMessage) {
      return targetMessage.id;
    } else {
      const sentMessage = await channel.send(`
                                             リアクションしてロールを付与しよう！
                                             :bell: : 通知勢 : たくさん通知が届くよ！
                                             :sound: : VC募集 : VCに参加したい人向け！
                                             `);

      return sentMessage.id;
    }
  } else {
    throw new Error("This channel can't send msg");
  }
}
