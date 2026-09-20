import type { Client } from "discord.js";

const CHANNEL_ID = "1454473598973509697";
const GUILD_ID = "1452263053180534806";
const MEMBER_ROLE_ID = "1454446371221536788";

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

    const roleMemberCounts = await guild.roles.fetchMemberCounts();

    const memberCount = roleMemberCounts.get(MEMBER_ROLE_ID);

    if (memberCount === undefined) {
      console.error("[ERROR] Student role count not found");
      return;
    }

    await channel.setName(`学生数: ${memberCount}`);

    console.log(`[INFO]  Updated member count in ${channel.name}`);
  } catch (error) {
    console.error(`[ERROR] Updating member count: ${error}`);
  }
}

export async function firstJob(client: Client) {
  console.log("[INFO] Starting first job...");

  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.members.fetch();

  console.log("[INFO] First job completed");
}
