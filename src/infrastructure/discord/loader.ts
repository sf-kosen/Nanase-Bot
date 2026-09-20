import fs from "node:fs";
import path from "node:path";
import type { Action, Actions } from "../../types/action";
import type { Command } from "../../types/command";
import { log, LoggerType } from "../logger";

export function loadCommands(commandsDir: string, fileType: string): Record<string, Command> {
  log(LoggerType.INFO, "Fetching command...", commandsDir);

  const commands: Record<string, Command> = {};
  if (!fs.existsSync(commandsDir)) return commands;

  const commandFiles = fs.readdirSync(commandsDir).filter((file) => file.endsWith(fileType));

  for (const file of commandFiles) {
    const command = require(path.resolve(commandsDir, file)).default as Command;
    log(LoggerType.INFO, `  Load: ${command.data.name}`);
    commands[command.data.name] = command;
  }

  return commands;
}

export function loadActions(handlersDir: string, fileType: string): Actions {
  log(LoggerType.INFO, "Fetching handlers...", handlersDir);

  const actions: Actions = { button: {}, modal: {} };
  const folders = ["button", "modal"];

  for (const folder of folders) {
    const actionDir = path.resolve(handlersDir, folder);
    if (!fs.existsSync(actionDir)) {
      log(LoggerType.INFO, `  Handler Type: ${folder} (none)`);
      continue;
    }

    const actionFiles = fs.readdirSync(actionDir).filter((file) => file.endsWith(fileType));
    log(LoggerType.INFO, `  Handler Type: ${folder}`);

    for (const file of actionFiles) {
      const action = require(path.resolve(actionDir, file)).default as Action;
      log(LoggerType.INFO, `    Load: ${action.data.action}`);
      actions[folder][action.data.action] = action;
    }
  }

  return actions;
}
