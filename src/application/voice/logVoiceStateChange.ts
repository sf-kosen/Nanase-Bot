import type { VoiceState } from "discord.js";
import { log, LoggerType } from "../../infrastructure/logger";

function logVoiceStateChange(oldState: VoiceState, newState: VoiceState): void {
  const username = newState.member?.user.username;

  if (oldState.channel && newState.channel) {
    log(LoggerType.INFO, `${username} moved from ${oldState.channel.name} to ${newState.channel.name}`);
    return;
  }
  if (oldState.channel && !newState.channel) {
    log(LoggerType.INFO, `${username} left ${oldState.channel.name}`);
    return;
  }
  if (!oldState.channel && newState.channel) {
    log(LoggerType.INFO, `${username} joined ${newState.channel.name}`);
  }
}

export { logVoiceStateChange };
