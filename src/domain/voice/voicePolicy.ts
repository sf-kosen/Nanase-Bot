import botConfig from "../../config/botConfig";

function isCustomTrigger(channelId: string): boolean {
  return channelId === botConfig.voice.customChannelId;
}

function shouldDeleteVoiceChannel(params: {
  parentId: string | null;
  channelId: string;
  memberCount: number;
}): boolean {
  const { parentId, channelId, memberCount } = params;
  if (parentId !== botConfig.voice.customCategoryId) return false;
  if (channelId === botConfig.voice.customChannelId) return false;
  if (botConfig.voice.protectChannelIds.includes(channelId)) return false;
  return memberCount === 0;
}

function customVoiceChannelName(username: string): string {
  return `🔊｜${username}の部屋`;
}

export { customVoiceChannelName, isCustomTrigger, shouldDeleteVoiceChannel };
