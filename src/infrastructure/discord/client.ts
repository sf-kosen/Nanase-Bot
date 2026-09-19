import { Client, GatewayIntentBits } from "discord.js";

const CLIENT_INTENTS: GatewayIntentBits[] = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
];

function createClient(): Client {
  return new Client({ intents: CLIENT_INTENTS });
}

export { CLIENT_INTENTS, createClient };
