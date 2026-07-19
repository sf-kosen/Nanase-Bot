import fs from "fs";
import path from "path";
import type { Action, Actions } from "../types/action";
import type { Command } from "../types/command.js";

export function loadCommands(BASE_DIR: string, FILE_TYPE: string): { [key: string]: Command } {
	console.log("FileType: ", FILE_TYPE);
	console.log("Base Directory: ", BASE_DIR);
	console.log("Fetching command...");

	const commands: { [key: string]: Command } = {};

	const commandFiles = fs.readdirSync(path.resolve(BASE_DIR, "commands")).filter((file) => file.endsWith(FILE_TYPE));

	for (const file of commandFiles) {
		const reqPath = path.resolve(BASE_DIR, "commands", file);
		const command = require(reqPath).default as Command;
		console.warn(`  Load: ${command.data.name}`);
		commands[command.data.name] = command;
	}

	console.log("End load command");
	console.log("");

	return commands;
}

export function loadActions(BASE_DIR: string, FILE_TYPE: string): Actions {
	console.log("Fetching handlers...");
	const actions: Actions = { button: {}, modal: {} };
	const folders = ["button", "modal"];

	for (const folder of folders) {
		const actionFiles = fs
			.readdirSync(path.resolve(BASE_DIR, "handlers", folder))
			.filter((file) => file.endsWith(FILE_TYPE));
		console.log(`  Handler Type: ${folder}`);

		for (const file of actionFiles) {
			const reqPath = path.resolve(BASE_DIR, "handlers", folder, file);
			const action = require(reqPath).default as Action<any>;
			console.log(`    Load: ${action.data.action}`);
			actions[folder][action.data.action] = action;
		}

		console.log(`  End load ${folder} handlers`);
		console.log("");
	}

	console.log("End load handlers");
	console.log("");

	return actions;
}
