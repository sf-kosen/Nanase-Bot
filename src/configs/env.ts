import dotenv from "dotenv";

dotenv.config();

export const env = {
  tokens: {
    discordToken: process.env.DISCORD_TOKEN,
  },
  role_id: {
    notifier: process.env.NOTIFIER_ROLE_ID,
    vc: process.env.VC_ROLE_ID,
  },
};
