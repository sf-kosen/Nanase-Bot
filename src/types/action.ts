import { ButtonInteraction, ModalSubmitInteraction } from "discord.js";

interface Action<ActionType = ButtonInteraction | ModalSubmitInteraction | any> {
    data: {
        action: string;
        defer?: boolean;
        flags?: number;
        
    };

    execute: (interaction: ActionType) => Promise<void>;
}

interface Actions {
    button: Record<string, Action<ButtonInteraction>>;
    modal: Record<string, Action<ModalSubmitInteraction>>;

    [key: string]: {
        [key: string]: Action<any>
    }
}

export type { Action, Actions };