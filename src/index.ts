import {
  Client,
  GatewayIntentBits,
  ModalSubmitInteraction,
  ButtonInteraction,
  Interaction,
  CacheType,
} from "discord.js";
import { Command, ModalCommand, ButtonCommand } from "./types/command.js";
import { Action, Actions } from "./types/action";
import { handleVcJoin } from "./handlers/events/vc-join";
import { handleVcLeave } from "./handlers/events/vc-leave";
import dotenv from "dotenv";
import fs from "fs";

import { updateMemberCount } from "./jobs/updateMemberCount";

dotenv.config({ path: ".env" });

// 実行環境に応じてファイルタイプとディレクトリを決定
const FILE_TYPE: string = process.argv[2] === "js" ? ".js" : ".ts";
const IS_PRODUCTION = FILE_TYPE === ".js";
const BASE_DIR = IS_PRODUCTION ? "./dist" : "./src";

const commands: { [key: string]: Command } = {};
const actions: Actions = { button: {}, modal: {} };

console.log("FileType: ", FILE_TYPE);
console.log("Base Directory: ", BASE_DIR);
console.log("Fetching command...");

const commandFiles = fs
  .readdirSync(`${BASE_DIR}/commands`)
  .filter((file) => file.endsWith(FILE_TYPE));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`).default as Command;
  console.warn(`  Load: ${command.data.name}`);
  commands[command.data.name] = command;
}
console.log("End load command");
console.log("");

console.log("Fetching handlers...");

const folders = ["button", "modal"];
for (const folder of folders) {
  const actionFiles = fs
    .readdirSync(`${BASE_DIR}/handlers/${folder}`)
    .filter((file) => file.endsWith(FILE_TYPE));
  console.log(`  Handler Type: ${folder}`);

  for (const file of actionFiles) {
    const path = `./handlers/${folder}/${file}`;
    const action = require(path).default as Action<any>;
    console.log(`    Load: ${action.data.action}`);

    actions[folder][action.data.action] = action;
  }

  console.log(`  End load ${folder} handlers`);
  console.log("");
}
console.log("End load handlers");
console.log("");

console.log("Registering commands...");

const client = new Client({
  intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
});

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  // Registering commands
  const data: Record<string, any>[] = [
    {
      name: "change-mode",
      description: "[Admin Only] Enable or disable development mode",
      options: [],
    },
  ];

  for (const commandName in commands) {
    console.warn(`  Registering command: ${commandName}`);
    data.push(commands[commandName].data);
  }

  await client.application?.commands.set(data as any);

  console.log("Commands registered successfully!");
  console.log("");
  console.log("Bot is ready!");
  console.log("");

  await updateMemberCount(client);

  return client.user?.setActivity("with Discord.js", { type: 0 });
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => { // コマンドの実行
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  const command: Command = commands[commandName];
  const flags = command.data.flags || 0;
  console.log(`Flags: ${flags}`);

  if (command.data.defer != false) {
    await interaction.deferReply({ flags });
  }

  if (!command) {
    console.error(`Command ${commandName} not found`);
    await interaction.followUp("This command does not exist!");
    return;
  }

  console.log(`Executing command: ${commandName}`);
  console.log("");

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => { // ボタンの実行
  if (!interaction.isButton()) return;

  const { customId } = interaction;
  const command: ButtonCommand = JSON.parse(customId);
  const actionName = command.action;
  const action: Action<ButtonInteraction> = actions.button[actionName];
  if (!action) {
    console.error(`Action ${actionName} not found`);
    await interaction.followUp("This action does not exist!");
    return;
  }

  const flags = action.data.flags || 0;

  if (action.data.defer) {
    await interaction.deferReply({ flags });
  }



  console.log(`Executing action: ${actionName}`);
  console.log("");

  try {
    await action.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this action!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this action!",
        ephemeral: true,
      });
    }
  }
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => { // ダイアログの実行
  if (!interaction.isModalSubmit()) return;

  const { customId } = interaction;
  const command: ModalCommand = JSON.parse(customId);
  const actionName = command.action;
  const action: Action<ModalSubmitInteraction> = actions.modal[actionName];
  if (!action) {
    console.error(`Action ${actionName} not found`);
    await interaction.followUp("This action does not exist!");
    return;
  }

  const flags: number = action.data.flags || 0;
  if (action.data.defer) {
    await interaction.deferReply({ flags });
  }

  console.log(`Executing action: ${actionName}`);
  console.log("");

  try {
    await action.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this action!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this action!",
        ephemeral: true,
      });
    }
  }
});

client.on("voiceStateUpdate", handleVcJoin);
client.on("voiceStateUpdate", handleVcLeave);
// メンバー数更新
client.on("guildMemberAdd", async (member) => {
  const time = Date.now();
  const date = new Date(time);

  // 第1期生ロールを付与
  if (date.getFullYear() == 2025) {
    member.roles.add("1454661774576980090");
  }

  await updateMemberCount(client);
});

// メンバー数更新
client.on("guildMemberRemove", async (member) => {
  await updateMemberCount(client);
});

export { FILE_TYPE, client, commands, actions };
client.login(process.env.DISCORD_TOKEN);
