import { VoiceState, ChannelType, PermissionFlagsBits } from "discord.js";
import botConfig from "../../../../bot.config";

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
                    id: botConfig.role.memberId,
                    allow: [
                        PermissionFlagsBits.ViewChannel, 
                        PermissionFlagsBits.Connect
                    ],
                },
                {
                    id: newState.member?.id || newState.member?.user.id || "",
                    allow: [
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.Speak,
                        PermissionFlagsBits.ViewChannel,
                    ],
                },
            ],
        });

        await newState.member?.voice.setChannel(channel);
        await channel.permissionOverwrites.create(newState.guild.roles.everyone, {
            ViewChannel: false,
        });
    } catch (error) {
        console.error("vc-join: チャンネル作成に失敗しました:", error);
    }
});

export { handleVcJoin };