import { ModalSubmitInteraction } from "discord.js";
import { Action } from "../../types/action";

const action: Action<ModalSubmitInteraction> = {
  data: {
    actionName: "sample",
  },
  execute: async (interaction: ModalSubmitInteraction) => {
    await interaction.followUp("This is a sample modal handler.");
  },
};

export default action;
