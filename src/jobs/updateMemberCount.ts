import { Client } from "discord.js";
import { getMemberStatus } from "../utils/getMemberStatus";

const CHANNEL_ID = "1454473598973509697";
const GUILD_ID = "1452263053180534806";

let membersFetched = false;

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

    const studentRole = guild.roles.cache.get("1454446371221536788");
    if (!studentRole) {
      console.error("[ERROR] Student role not found");
      return;
    }

    if (!membersFetched) {
      console.log("[INFO]  Member cache is not fetched. Creating...");
      await firstJob(client);
    }

    const memberCount = studentRole.members.size;

    await channel.setName(`学生数: ${memberCount}`);
    console.log(`[INFO]  Updated member count in ${channel.name}`);
  } catch (error) {
    console.error(`[ERROR] Updating member count: ${error}`);
  }
}

export async function firstJob(client: Client) {
  console.log("[INFO]  Starting first job...");

  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.members.fetch();
  membersFetched = true;

  console.log("[INFO]  First job completed");
}
