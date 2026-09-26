export type ReactionRoleKind = "notifier" | "vc";

export const EMOJI_ROLE_MAP: Record<string, ReactionRoleKind> = {
  "🔔": "notifier",
  "🔉": "vc",
};

export function resolveReactionRole(emoji: string): ReactionRoleKind | null {
  return EMOJI_ROLE_MAP[emoji] ?? null;
}

export const REACTION_ROLE_MESSAGE = [
  "リアクションしてロールを付与しよう！",
  "- 🔔 : 通知勢",
  "> たくさん通知が届くよ！",
  "- 🔉 : VC募集",
  "> VCに参加したい人向け！",
].join("\n");
