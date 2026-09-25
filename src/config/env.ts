import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const env = {
  discordToken: process.env.DISCORD_TOKEN,
  botId: process.env.BOT_ID,
  webhookUrl: process.env.WEBHOOK_URL,
};
