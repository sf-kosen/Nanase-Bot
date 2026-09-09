import dotenv from "dotenv";

dotenv.config();

export const env = {
  channelID: {
    memberCount: process.env.MEMBERCOUNT_CHANNEL_ID!,
    reactionRole: process.env.REACTIONROLE_CHANNEL_ID!,
    recruitNotice: process.env.RECRUITNOTICE_CHANNEL_ID!,
  },

  info: {
    botID: process.env.BOT_ID!,
    guildID: process.env.GUILD_ID!,
  },

  role_id: {
    bot: process.env.BOT_ROLE_ID!,
    notifier: process.env.NOTIFIER_ROLE_ID!,
    student: process.env.STUDENT_ROLE_ID!,
    term: process.env.TERM_ROLE_ID!,
    vc: process.env.VC_ROLE_ID!,
  },

  token: {
    discord: process.env.DISCORD_TOKEN!,
  },
};
