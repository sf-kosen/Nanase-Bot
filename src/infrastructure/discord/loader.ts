import fs from "node:fs";
import path from "node:path";
import type { Action, Actions } from "../../types/action";
import type { Command } from "../../types/command";
import { logger } from "../logger";

function loadCommands(commandsDir: string, fileType: string): Record<string, Command> {
  logger.info("Fetching command...", commandsDir);

  const commands: Record<string, Command> = {};
  if (!fs.existsSync(commandsDir)) return commands;

  const commandFiles = fs.readdirSync(commandsDir).filter((file) => file.endsWith(fileType));

  for (const file of commandFiles) {
    const command = require(path.resolve(commandsDir, file)).default as Command;
    logger.info(`  Load: ${command.data.name}`);
    commands[command.data.name] = command;
  }

  return commands;
}

function loadActions(handlersDir: string, fileType: string): Actions {
  logger.info("Fetching handlers...", handlersDir);

  const actions: Actions = { button: {}, modal: {} };
  const folders = ["button", "modal"];

  for (const folder of folders) {
    const actionDir = path.resolve(handlersDir, folder);
    if (!fs.existsSync(actionDir)) {
      logger.info(`  Handler Type: ${folder} (none)`);
      continue;
    }

    const actionFiles = fs.readdirSync(actionDir).filter((file) => file.endsWith(fileType));
    logger.info(`  Handler Type: ${folder}`);

    for (const file of actionFiles) {
      const action = require(path.resolve(actionDir, file)).default as Action;
      logger.info(`    Load: ${action.data.action}`);
      actions[folder][action.data.action] = action;
    }
  }

  return actions;
}

export { loadActions, loadCommands };
