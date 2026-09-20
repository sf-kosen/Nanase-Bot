import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const env = {
  discordToken: process.env.DISCORD_TOKEN,
  botId: process.env.BOT_ID,
  reactionRoleChannelId: process.env.REACTIONROLE_CHANNEL_ID,
  notifierRoleId: process.env.NOTIFIER_ROLE_ID,
  vcRoleId: process.env.VC_ROLE_ID,
  webhookUrl: process.env.WEBHOOK_URL,
};
