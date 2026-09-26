import type { ButtonInteraction, CacheType, Interaction, ModalSubmitInteraction } from "discord.js";
import { log, LoggerType } from "../../infrastructure/logger";
import type { Action, Actions } from "../../types/action";
import type { ButtonCommand, Command, ModalCommand } from "../../types/command";

function parseCustomId(customId: string): { action: string } | null {
  try {
    const parsed = JSON.parse(customId);
    if (typeof parsed !== "object" || parsed === null || typeof parsed.action !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function sendInteractionError(
  interaction: Interaction<CacheType>,
  message: string,
  err?: unknown,
): Promise<void> {
  log(LoggerType.ERROR, err);
  const target = interaction as {
    replied?: boolean;
    deferred?: boolean;
    followUp?: (payload: unknown) => Promise<unknown>;
    reply?: (payload: unknown) => Promise<unknown>;
  };
  try {
    if (target.replied || target.deferred) {
      await target.followUp?.({ content: message, ephemeral: true });
    } else if (typeof target.reply === "function") {
      await target.reply({ content: message, ephemeral: true });
    }
  } catch (e) {
    log(LoggerType.ERROR, "Failed to send error message to interaction", e);
  }
}

export default function createInteractionRouter(commands: Record<string, Command>, actions: Actions) {
  return async (interaction: Interaction<CacheType>): Promise<void> => {
    try {
      if (interaction.isCommand()) {
        const command: Command | undefined = commands[interaction.commandName];
        if (!command) {
          log(LoggerType.ERROR, `Command ${interaction.commandName} not found`);
          await interaction.followUp("This command does not exist!");
          return;
        }

        const flags = command.data.flags || 0;
        if (command.data.defer !== false) await interaction.deferReply({ flags });

        log(LoggerType.INFO, `Executing command: ${interaction.commandName}`);
        await command.execute(interaction as never);
        return;
      }

      if (interaction.isButton()) {
        const command = parseCustomId(interaction.customId) as ButtonCommand | null;
        if (!command) {
          log(LoggerType.ERROR, `Invalid button customId: ${interaction.customId}`);
          await interaction.deferUpdate();
          return;
        }

        const action: Action<ButtonInteraction> | undefined = actions.button[command.action];
        if (!action) {
          log(LoggerType.ERROR, `Action ${command.action} not found`);
          await interaction.followUp("This action does not exist!");
          return;
        }

        const flags = action.data.flags || 0;
        if (action.data.defer) await interaction.deferReply({ flags });

        log(LoggerType.INFO, `Executing action: ${command.action}`);
        await action.execute(interaction);
        return;
      }

      if (interaction.isModalSubmit()) {
        const command = parseCustomId(interaction.customId) as ModalCommand | null;
        if (!command) {
          log(LoggerType.ERROR, `Invalid modal customId: ${interaction.customId}`);
          await interaction.reply({ content: "invalid request", ephemeral: true });
          return;
        }

        const action: Action<ModalSubmitInteraction> | undefined = actions.modal[command.action];
        if (!action) {
          log(LoggerType.ERROR, `Action ${command.action} not found`);
          await interaction.followUp("This action does not exist!");
          return;
        }

        const flags = action.data.flags || 0;
        if (action.data.defer) await interaction.deferReply({ flags });

        log(LoggerType.INFO, `Executing action: ${command.action}`);
        await action.execute(interaction);
        return;
      }
    } catch (error) {
      await sendInteractionError(interaction, "There was an error while executing this interaction!", error);
    }
  };
}
