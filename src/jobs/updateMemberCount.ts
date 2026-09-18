import type { Client } from "discord.js";

const CHANNEL_ID = "1454473598973509697";
const GUILD_ID = "1452263053180534806";

export async function updateMemberCount(client: Client) {
  console.log("[INFO]  Starting member count job...");

  try {
    console.log("[INFO]  Updating member count...");

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
      console.error("[ERROR] Guild not found");
      return;
    }

    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      console.error("[ERROR] Channel not found or not a text channel");
      return;
    }

    const counts = await guild.roles.fetchMemberCounts();

    const memberCount = counts.get("1454446371221536788");

    if (memberCount === undefined) {
      console.error("[ERROR] fetch memberCount failed");
      return;
    }

    await channel.setName(`学生数: ${memberCount}`);

    console.log(`[INFO]  Updated member count in ${channel.name}`);
  } catch (error) {
    console.error(`[ERROR] Updating member count: ${error}`);
  }
}
