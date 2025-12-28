import { ModalSubmitInteraction } from "discord.js";
import { Action } from "../../types/action";

/**
 * Sample modal handler
 */

module.exports = {
    data: {
        action: "sample_modal",
    },

    async execute(interaction: ModalSubmitInteraction) {
        await interaction.reply({ content: "モーダルが送信されました！", ephemeral: true });
    }
} as Action<ModalSubmitInteraction>;