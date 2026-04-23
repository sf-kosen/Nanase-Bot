import { VoiceState, ChannelType, PermissionFlagsBits } from "discord.js";
import botConfig from "../../../../bot.config";

const handleVcJoin = (async (oldState: VoiceState, newState: VoiceState) => {
    if (!newState.channel) return;

    const channelId = newState.channel.id;
    if (channelId !== botConfig.voice.customChannelId) return;

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
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                ],
            },
            {
                id: memberId,
                allow: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak,
                    PermissionFlagsBits.ViewChannel,
                ],
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
            name: `🔊｜${newState.member?.user.username}の部屋`,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parentId ?? undefined,
            permissionOverwrites,
        });

        await newState.member?.voice.setChannel(channel);
    } catch (error) {
        console.error("vc-join: チャンネル作成に失敗しました:", error);
    }
});

export { handleVcJoin };
