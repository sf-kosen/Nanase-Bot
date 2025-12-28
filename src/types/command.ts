import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';

interface Command {
    data: {
        name: string;        // コマンド名（英語小文字とハイフンのみだったはず）
        description: string; // コマンドの説明（自由。長すぎずシンプルに）
        flags: number;       // レスポンスのフラグ。荒らし防止のためEphemeral推奨
        defer?: boolean;      // コマンド実行時にdeferを行うかどうか。処理に時間がかかる場合はtrue推奨
        options?: Array<{    // コマンドのオプション（引数）。不要なら省略可
            name: string;
            description: string;
            type:
            | ApplicationCommandOptionType.Subcommand
            | ApplicationCommandOptionType.SubcommandGroup
            | ApplicationCommandOptionType.String
            | ApplicationCommandOptionType.Integer
            | ApplicationCommandOptionType.Boolean
            | ApplicationCommandOptionType.User
            | ApplicationCommandOptionType.Channel
            | ApplicationCommandOptionType.Role
            | ApplicationCommandOptionType.Mentionable
            | ApplicationCommandOptionType.Number
            | ApplicationCommandOptionType.Attachment;
            required?: boolean;
            choices?: Array<{
                name: string;
                value: string | number;
            }>;
        }>;
    };

    execute: (interaction: CommandInteraction) => Promise<void>;
}

interface ButtonCommand {
    data: {
        action: string;
        flags: number;
        defer?: boolean;
    };

    value: Record<string, any>;
}

interface ModalCommand {
    data: {
        action: string;
        flags?: number;
        defer?: boolean;
    };

    value: Record<string, any>;
}

export type { Command, ButtonCommand, ModalCommand };