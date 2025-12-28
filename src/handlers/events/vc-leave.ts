import { VoiceState, ChannelType } from "discord.js";
import botConfig from "../../../bot.config";

const handleVcLeave = (async (oldState: VoiceState, newState: VoiceState) => {
    if (!oldState.channel) return;
    const channel = oldState.channel;
    if (channel.parent?.id !== botConfig.customVoiceCategoryId) return;
    if (channel.id === botConfig.customVoiceChannelId) return;

    if (channel.members.size === 0) {
        await channel.delete();
    }
});

export { handleVcLeave };