import type { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";

export interface Command {
  data: {
    name: string; // コマンド名（英語小文字とハイフンのみだったはず）
    description: string; // コマンドの説明（自由。長すぎずシンプルに）
    flags: number; // レスポンスのフラグ。荒らし防止のためEphemeral推奨
    defer?: boolean; // コマンド実行時にdeferを行うかどうか。処理に時間がかかる場合はtrue推奨
    default_member_permissions?: string; // コマンド実行に必要な権限(ビットフラグ文字列)
    options?: Array<{
      // コマンドのオプション（引数）。不要なら省略可
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

  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface ButtonCommand {
  action: string;

  value?: Record<string, any>;
}

export interface ModalCommand {
  action: string;

  value?: Record<string, any>;
}
