import path from "node:path";
import { env } from "./config/env";
import { createClient } from "./infrastructure/discord/client";
import { loadActions, loadCommands } from "./infrastructure/discord/loader";
import { log, LoggerType } from "./infrastructure/logger";
import registerEvents from "./presentation/events";

// 実行中ファイルの拡張子から、読み込むモジュール種別を決定する。
// ts-node では .ts、コンパイル後の Node.js では .js になる。
const FILE_TYPE = path.extname(__filename);
if (![".js", ".ts"].includes(FILE_TYPE)) {
  throw new Error(`Unsupported entry-point extension: ${FILE_TYPE || "(none)"}`);
}

const PRESENTATION_DIR = path.resolve(__dirname, "presentation");

const commands = loadCommands(path.resolve(PRESENTATION_DIR, "commands"), FILE_TYPE);
const actions = loadActions(path.resolve(PRESENTATION_DIR, "interactions"), FILE_TYPE);

const client = createClient();
registerEvents(client, { commands, actions });

client.login(env.discordToken).catch((error) => {
  log(LoggerType.ERROR, "Failed to login Discord client:", error);
});
