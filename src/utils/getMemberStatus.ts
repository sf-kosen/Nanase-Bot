import { Guild } from "discord.js";

export async function getMemberStatus(guild: Guild) {
  await guild.members.fetch();

  return {
    total: guild.memberCount,
    humans: guild.members.cache.filter((m) => !m.user.bot).size,
    bots: guild.members.cache.filter((m) => m.user.bot).size,
  };
}
