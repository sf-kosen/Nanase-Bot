import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  type ButtonBuilder,
  ChannelType,
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import { botConfig } from "../../config/botConfig";
import { TicketCooldown } from "../../domain/ticket/ticketPolicy";
import { log, LoggerType } from "../../infrastructure/logger";
import type { Command } from "../../types/command";
import createButton from "../interactions/createButton";

const cooldown = new TicketCooldown();

function errorEmbed(description: string): EmbedBuilder {
  return new EmbedBuilder().setTitle("エラー").setDescription(description).setColor(Colors.Red);
}

export default {
  data: {
    name: "ticket",
    description: "チケットボードを作成します",
    flags: MessageFlags.Ephemeral,
    default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
    defer: true,

    options: [
      {
        name: "category",
        description: "チケットを作成するカテゴリーの名前",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "label",
        description: "チケット作成ボタンのラベル",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "title",
        description: "チケット作成ボードのタイトル",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "description",
        description: "チケット作成ボードの説明文",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.channel;
    const name = interaction.options.getString("category", true);
    const label = interaction.options.getString("label") || "チケットを作成";
    const title = interaction.options.getString("title") || "チケットボード";
    const description =
      interaction.options.getString("description") || "以下のボタンを押してチケットを作成してください。";

    if (!channel) {
      await interaction.followUp({ embeds: [errorEmbed("このコマンドはチャンネル内で実行してください。")] });
      return;
    }

    const memberPermissions = interaction.memberPermissions;
    if (!memberPermissions?.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.followUp({
        embeds: [errorEmbed("このコマンドを実行するにはチャンネル管理権限が必要です。")],
      });
      return;
    }

    const remaining = cooldown.remaining(interaction.user.id, Date.now());
    if (remaining > 0) {
      await interaction.followUp({
        embeds: [errorEmbed(`チケットボードの作成は60秒に1回までです。あと${remaining}秒お待ちください。`)],
      });
      return;
    }

    try {
      const moderator = interaction.guild?.roles.cache.get(botConfig.role.moderatorId);
      if (!moderator) {
        await interaction.followUp({
          embeds: [errorEmbed("モデレーターロールが見つかりません。設定を確認してください。")],
        });
        return;
      }

      const category = await interaction.guild?.channels.create({
        name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["ViewChannel"],
          },
          {
            id: moderator,
            allow: ["ViewChannel", "ManageChannels", "ManageMessages"],
          },
        ],
      });

      const button = createButton({
        label,
        customId: {
          action: "ticket-open",
          value: { category: category?.id },
        },
      });
      const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(Colors.Aqua);
      const actionRow = new ActionRowBuilder<ButtonBuilder>();
      actionRow.addComponents(button);

      cooldown.record(interaction.user.id, Date.now());
      await interaction.followUp({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      log(LoggerType.ERROR, error);
      await interaction.followUp({ embeds: [errorEmbed("チケットボードの作成中にエラーが発生しました。")] });
    }
  },
} as Command;
