import {
  Client,
  GatewayIntentBits,
  ModalSubmitInteraction,
  ButtonInteraction,
  Interaction,
  CacheType,
  GuildMember,
} from "discord.js";
import { Command, ModalCommand, ButtonCommand } from "./types/command";
import { Action, Actions } from "./types/action";
import { handleVcJoin } from "./handlers/events/vc/join";
import { handleVcLeave } from "./handlers/events/vc/leave";
import { handleVcLogger } from "./handlers/events/vc/logger";
import { updateMemberCount, firstJob } from "./jobs/updateMemberCount";
import { loadCommands, loadActions } from "./utils/loader";
import dotenv from "dotenv";
import noticeNewRecruit from "./jobs/noticeNewRecruit";
import addReactionRole from "./handlers/events/reactionRole/addReactionRole";
import removeReactionRole from "./handlers/events/reactionRole/removeReactionRole";
import checkReactionRoleMessage from "./jobs/checkReactionRoleMessage";

dotenv.config({ path: ".env" });

// 実行環境に応じてファイルタイプとディレクトリを決定
const FILE_TYPE: string = process.argv[2] === "js" ? ".js" : ".ts";
const IS_PRODUCTION = FILE_TYPE === ".js";
const BASE_DIR = IS_PRODUCTION ? "./dist" : "./src";

const CLIENT_INTENTS: GatewayIntentBits[] = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
];

let commands: { [key: string]: Command } = {};
let actions: Actions = { button: {}, modal: {} };

commands = loadCommands(BASE_DIR, FILE_TYPE);
actions = loadActions(BASE_DIR, FILE_TYPE);

console.log("Registering commands...");

const client = new Client({
  intents: CLIENT_INTENTS,
});

let reactionRoleMessage: string = "";

async function runSafely(label: string, task: () => Promise<void>) {
  try {
    await task();
  } catch (error) {
    console.error(`[ERROR] ${label}:`, error);
  }
}

async function addRoleSafely(member: GuildMember, roleId: string, label: string) {
  try {
    await member.roles.add(roleId);
  } catch (error) {
    console.error(`[ERROR] Failed to add ${label} role (${roleId}):`, error);
  }
}

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  await runSafely("Registering commands", async () => {
    const data: Record<string, any>[] = new Array();

    for (const commandName in commands) {
      console.warn(`  Registering command: ${commandName}`);
      data.push(commands[commandName].data);
    }

    await client.application?.commands.set(data as any);

    console.log("Commands registered successfully!");
  });
  console.log("");
  console.log("Bot is ready!");
  console.log("");

  await runSafely("Initial member fetch", () => firstJob(client));
  await runSafely("Initial member count update", () => updateMemberCount(client));

  await runSafely("Reaction role message check", async () => {
    const result = await checkReactionRoleMessage(client);
    if (!result) {
      console.error("This channel can't send msg");
      return;
    }
    reactionRoleMessage = result;
  });

  await runSafely("Setting bot activity", async () => {
    client.user?.setActivity("with Discord.js", { type: 0 });
  });
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
      let command: ButtonCommand;
      try {
        const parsed = JSON.parse(customId);
        if (typeof parsed !== "object" || parsed === null || typeof parsed.action !== "string") {
          console.error(`Invalid button customId format: ${customId}`);
          await interaction.deferUpdate();
          return;
        }
        command = parsed as ButtonCommand;
      } catch {
        console.error(`Failed to parse button customId: ${customId}`);
        await interaction.deferUpdate();
        return;
      }
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
      let command: ModalCommand;
      try {
        const parsed = JSON.parse(customId);
        if (typeof parsed !== "object" || parsed === null || typeof parsed.action !== "string") {
          console.error(`Invalid modal customId format: ${customId}`);
          await interaction.reply({ content: "invalid request", ephemeral: true });
          return;
        }
        command = parsed as ModalCommand;
      } catch {
        console.error(`Failed to parse modal customId: ${customId}`);
        await interaction.reply({ content: "invalid request", ephemeral: true });
        return;
      }
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
    await addRoleSafely(member, "1454099602641780737", "bot");

    // 学生ロールを付与
    await addRoleSafely(member, "1454099602641780737", "student");
  }

  // 年に応じたロールを付与
  if (date.getFullYear() == 2025) {
    await addRoleSafely(member, "1454661774576980090", "2025 student");
  } else if (date.getFullYear() == 2026) {
    await addRoleSafely(member, "1455864840630308925", "2026 student");
  }
});

// メンバー数更新
client.on("guildMemberRemove", async (member) => {
  await updateMemberCount(client);
});

client.on("threadCreate", async (thread, newlyCreated) => {
  if (thread.parentId === "1454093291325886658") {
    console.log("[noticeNewRecruit] Detect new Recruit");
    await runSafely("Notice new recruit thread", () =>
      noticeNewRecruit(client, thread),
    );
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

  //　学生ロールの付与、剥奪を検知して学生数カウントを更新
  if (
    (!oldMember.roles.cache.has("1454446371221536788") &&
      newMember.roles.cache.has("1454446371221536788")) ||
    (oldMember.roles.cache.has("1454446371221536788") &&
      !newMember.roles.cache.has("1454446371221536788"))
  ) {
    await updateMemberCount(client);
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  const message = reaction.message;
  const member = message?.guild?.members.resolve(user.id);

  console.log("[INFO]  messageReactionAdded");
  console.log(`   -> message: ${message.content?.toString()}`);
  console.log(`   -> member : ${member?.displayName}`);

  if (!member || !reaction.emoji.name) return;

  console.log(`   -> react  : ${reaction.emoji.name}`);

  // ReactionRole: ロール付与
  if (message.id === reactionRoleMessage) {
    try {
      await addReactionRole(member, reaction.emoji.name);
    } catch (e) {
      console.error(e);
    }
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  const message = reaction.message;
  const member = message?.guild?.members.resolve(user.id);

  console.log("[INFO]  messageReactionAdded");
  console.log(`   -> message: ${message.content?.toString()}`);
  console.log(`   -> member : ${member?.displayName}`);

  if (!member || !reaction.emoji.name) return;

  console.log(`   -> react  : ${reaction.emoji.name}`);

  // ReactionRole: ロール剥奪
  if (message.id === reactionRoleMessage) {
    try {
      await removeReactionRole(member, reaction.emoji.name);
    } catch (e) {
      console.error(e);
      // この先通知処理も追加
    }
  }
});

export { FILE_TYPE, client, commands, actions };
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("[ERROR] Failed to login Discord client:", error);
});
