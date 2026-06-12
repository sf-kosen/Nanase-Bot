import type { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import removeReactionRole from "../../services/reactionRole/removeReactionRole";

export default async function onMessageReactionRemove(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
  const message = reaction.message;
  const member = message?.guild?.members.resolve(user.id);

  console.log("[INFO]  messageReactionRemove");
  console.log(`   -> message: ${message.content?.toString()}`);
  console.log(`   -> member : ${member?.displayName}`);

  if (!member || !reaction.emoji.name) return;

  console.log(`   -> react  : ${reaction.emoji.name}`);

  // ReactionRole: ロール剥奪
  if (message.id === reactionRoleMessage) {
    try {
      await removeReactionRole(member, reaction.emoji.name);
    } catch (e) {
      console.error(e);
      // この先通知処理も追加
    }
  }
}
