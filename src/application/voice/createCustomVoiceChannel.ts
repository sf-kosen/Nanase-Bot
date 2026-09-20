import { ChannelType, PermissionFlagsBits, type VoiceState } from "discord.js";
import botConfig from "../../config/botConfig";
import { customVoiceChannelName, isCustomTrigger } from "../../domain/voice/voicePolicy";
import { log, LoggerType } from "../../infrastructure/logger";

export async function createCustomVoiceChannel(_oldState: VoiceState, newState: VoiceState): Promise<void> {
  if (!newState.channel) return;
  if (!isCustomTrigger(newState.channel.id)) return;

  const memberId = newState.member?.id ?? newState.member?.user.id;
  if (!memberId) return;

  try {
    const permissionOverwrites = [
      {
        id: newState.guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: botConfig.role.memberId,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
      },
      {
        id: memberId,
        allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.ViewChannel],
      },
    ];

    const botMember = newState.guild.members.me;
    if (botMember) {
      permissionOverwrites.push({
        id: botMember.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.MoveMembers,
        ],
      });
    }

    const channel = await newState.guild.channels.create({
      name: customVoiceChannelName(newState.member?.user.username ?? "unknown"),
      type: ChannelType.GuildVoice,
      parent: newState.channel.parentId ?? undefined,
      permissionOverwrites,
    });

    await newState.member?.voice.setChannel(channel);
  } catch (error) {
    log(LoggerType.ERROR, "vc-join: チャンネル作成に失敗しました:", error);
  }
}
