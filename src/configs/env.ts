import dotenv from "dotenv";

dotenv.config();

export const env = {
  info: {
    botID: process.env.BOT_ID,
  },
  tokens: {
    discordToken: process.env.DISCORD_TOKEN,
  },
  channelID: {
    reactionRole: process.env.REACTIONROLE_CHANNEL_ID,
  },
  roleID: {
    notifier: process.env.NOTIFIER_ROLE_ID,
    vc: process.env.VC_ROLE_ID,
  },
};
