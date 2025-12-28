import { VoiceState, ChannelType, PermissionFlagsBits } from "discord.js";
import botConfig from "../../../bot.config";

const handleVcJoin = (async (oldState: VoiceState, newState: VoiceState) => {
    if (!newState.channel) return;

    const channelId = newState.channel.id;
    if (channelId !== botConfig.customVoiceChannelId) return;

    const channel = await newState.guild.channels.create({
        name : `🔊｜${newState.member?.user.username}の部屋`,
        type: ChannelType.GuildVoice,
        parent: newState.channel.parent,
        permissionOverwrites: [
            {
                id: newState.member?.user.id || "",
                allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels]
            }
        ]
    });

    await newState.member?.voice.setChannel(channel);
});

export { handleVcJoin };