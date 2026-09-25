import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const env = {
  discordToken: process.env.DISCORD_TOKEN,
  webhookUrl: process.env.WEBHOOK_URL,
};
