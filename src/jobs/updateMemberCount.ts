import type { Client } from "discord.js";
import { env } from "./../configs/env";

let membersFetched = false;

export async function updateMemberCount(client: Client) {
  console.log("[INFO]  Starting member count job...");

  try {
    console.log("[INFO]  Updating member count...");

    const guild = client.guilds.cache.get(env.info.guildID);
    if (!guild) {
      console.error("[ERROR] Guild not found");
      return;
    }

    const channel = guild.channels.cache.get(env.channelID.memberCount);
    if (!channel || !channel.isTextBased()) {
      console.error("[ERROR] Channel not found or not a text channel");
      return;
    }

    const studentRole = guild.roles.cache.get(env.role_id.student);
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

  const guild = await client.guilds.fetch(env.info.guildID);
  await guild.members.fetch();
  membersFetched = true;

  console.log("[INFO]  First job completed");
}
