import { VoiceState, ChannelType, PermissionFlagsBits } from "discord.js";
import botConfig from "../../../bot.config";

const handleVcJoin = (async (oldState: VoiceState, newState: VoiceState) => {
    if (!newState.channel) return;

    const channelId = newState.channel.id;
    if (channelId !== botConfig.voice.customChannelId) return;

    try {
        const channel = await newState.guild.channels.create({
            name: `🔊｜${newState.member?.user.username}の部屋`,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parentId ?? undefined,
            permissionOverwrites: [
                {
                    id: newState.member?.id || newState.member?.user.id || "",
                    allow: [
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.Speak,
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ManageChannels,
                    ],
                },
            ],
        });

        await newState.member?.voice.setChannel(channel);
    } catch (error) {
        console.error("vc-join: チャンネル作成に失敗しました:", error);
    }
});

export { handleVcJoin };