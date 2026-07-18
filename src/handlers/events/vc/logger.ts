import type { VoiceState } from "discord.js";

const handleVcLogger = async (oldState: VoiceState, newState: VoiceState) => {
	if (oldState.channel && newState.channel) {
		console.log(`${newState.member?.user.username} moved from ${oldState.channel.name} to ${newState.channel.name}`);
		return;
	}
	if (oldState.channel && !newState.channel) {
		console.log(`${newState.member?.user.username} left ${oldState.channel.name}`);
		return;
	}
	if (!oldState.channel && newState.channel) {
		console.log(`${newState.member?.user.username} joined ${newState.channel.name}`);
		return;
	}
};

export { handleVcLogger };
