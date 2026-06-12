import dotenv from "dotenv"

dotenv.config()

export const env = {
  tokens: {
    discordToken: process.env.DISCORD_TOKEN
  }
}
