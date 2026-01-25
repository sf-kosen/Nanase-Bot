import {
  Client,
  GatewayIntentBits,
  ModalSubmitInteraction,
  ButtonInteraction,
  Interaction,
  CacheType,
} from "discord.js";
import { Command, ModalCommand, ButtonCommand } from "./types/command";
import { Action, Actions } from "./types/action";
import { handleVcJoin } from "./handlers/events/vc/join";
import { handleVcLeave } from "./handlers/events/vc/leave";
import { handleVcLogger } from "./handlers/events/vc/logger";
import { updateMemberCount } from "./jobs/updateMemberCount";
import { loadCommands, loadActions } from "./utils/loader";
import dotenv from "dotenv";
import noticeNewRecruit from "./jobs/noticeNewRecruit";

dotenv.config({ path: ".env" });

// 実行環境に応じてファイルタイプとディレクトリを決定
const FILE_TYPE: string = process.argv[2] === "js" ? ".js" : ".ts";
const IS_PRODUCTION = FILE_TYPE === ".js";
const BASE_DIR = IS_PRODUCTION ? "./dist" : "./src";

let commands: { [key: string]: Command } = {};
let actions: Actions = { button: {}, modal: {} };

commands = loadCommands(BASE_DIR, FILE_TYPE);
actions = loadActions(BASE_DIR, FILE_TYPE);

console.log("Registering commands...");

const client = new Client({
  intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
});

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  // Registering commands
  const data: Record<string, any>[] = new Array();

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

function logAndSendError(interaction: any, message: string, err?: any) {
  console.error(err);
  return (async () => {
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: message,
          ephemeral: true,
        } as any);
      } else if (typeof interaction.reply === "function") {
        await interaction.reply({ content: message, ephemeral: true } as any);
      }
    } catch (e) {
      console.error("Failed to send error message to interaction", e);
    }
  })();
}

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
  try {
    // コマンド
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      const command: Command | undefined = commands[commandName];
      if (!command) {
        console.error(`Command ${commandName} not found`);
        await interaction.followUp("This command does not exist!");
        return;
      }

      const flags = command.data.flags || 0;
      if (command.data.defer != false) await interaction.deferReply({ flags });

      console.log(`Executing command: ${commandName}`);
      await command.execute(interaction as any);
      return;
    }

    // ボタン
    if (interaction.isButton()) {
      const { customId } = interaction;
      const command: ButtonCommand = JSON.parse(customId);
      const actionName = command.action;
      const action: Action<ButtonInteraction> | undefined =
        actions.button[actionName];
      if (!action) {
        console.error(`Action ${actionName} not found`);
        await interaction.followUp("This action does not exist!");
        return;
      }

      const flags = action.data.flags || 0;
      if (action.data.defer) await interaction.deferReply({ flags });

      console.log(`Executing action: ${actionName}`);
      await action.execute(interaction as ButtonInteraction);
      return;
    }

    // モーダル
    if (interaction.isModalSubmit()) {
      const { customId } = interaction;
      const command: ModalCommand = JSON.parse(customId);
      const actionName = command.action;
      const action: Action<ModalSubmitInteraction> | undefined =
        actions.modal[actionName];
      if (!action) {
        console.error(`Action ${actionName} not found`);
        await interaction.followUp("This action does not exist!");
        return;
      }

      const flags: number = action.data.flags || 0;
      if (action.data.defer) await interaction.deferReply({ flags });

      console.log(`Executing action: ${actionName}`);
      await action.execute(interaction as ModalSubmitInteraction);
      return;
    }
  } catch (error) {
    await logAndSendError(
      interaction,
      "There was an error while executing this interaction!",
      error,
    );
  }
});

client.on("voiceStateUpdate", handleVcLogger);
client.on("voiceStateUpdate", handleVcJoin);
client.on("voiceStateUpdate", handleVcLeave);

client.on("guildMemberAdd", async (member) => {
  const time = Date.now();
  const date = new Date(time);

  if (member.user.bot) {
    // BOTロールを付与
    member.roles.add("1454099602641780737");

    // 学生ロールを付与
    member.roles.add("1454099602641780737");
  }

  // 年に応じたロールを付与
  if (date.getFullYear() == 2025) {
    member.roles.add("1454661774576980090");
  } else if (date.getFullYear() == 2026) {
    member.roles.add("1455864840630308925");
  }
});

// メンバー数更新
client.on("guildMemberRemove", async (member) => {
  await updateMemberCount(client);
});

client.on("threadCreate", async (thread, newlyCreated) => {
  if (thread.parentId === "1454093291325886658") {
    console.log("[noticeNewRecruit] Detect new Recruit");
    noticeNewRecruit(client, thread);
  }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  console.log("[INFO]  Detect guildMemberUpdate");
  console.log("-> NEW MEMBER");
  console.log(
    `   -> hasStudentRole: ${newMember.roles.cache.has("1454446371221536788")}`,
  );
  console.log("-> OLD MEMBER");
  console.log(
    `   -> hasStudentRole: ${oldMember.roles.cache.has("1454446371221536788")}`,
  );

  //　学生ロールの付与を検知して学生数カウントを更新
  if (
    !oldMember.roles.cache.has("1454446371221536788") &&
    newMember.roles.cache.has("1454446371221536788")
  ) {
    await updateMemberCount(client);
  }
});

export { FILE_TYPE, client, commands, actions };
client.login(process.env.DISCORD_TOKEN);
