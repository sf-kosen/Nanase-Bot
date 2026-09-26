import { Client, GatewayIntentBits } from "discord.js";

export const CLIENT_INTENTS: GatewayIntentBits[] = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
];

export function createClient(): Client {
  return new Client({ intents: CLIENT_INTENTS });
}
