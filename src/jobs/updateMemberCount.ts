import { Client } from "discord.js";
import { getMemberStatus } from "../utils/getMemberStatus";

export async function updateMemberCount(client: Client) {
  const CHANNEL_ID = "1454473598973509697";
  const GUILD_ID = "1452263053180534806";

  console.log("Starting member count job...");

  try {
    console.log("Updating member count...");

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;

    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (!channel || !channel.isVoiceBased()) return;

    const { humans: memberCount } = await getMemberStatus(guild);

    await channel.setName(`学生数: ${memberCount}`);
    console.log(`Updated member count in ${channel.name}`);
  } catch (error) {
    console.error(`Error updating member count: ${error}`);
  }
}
