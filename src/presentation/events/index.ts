import type { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { grantJoinRoles } from "../../application/member/grantJoinRoles";
import { updateMemberCount } from "../../application/member/updateMemberCount";
import { reactionRoleMessageStore } from "../../application/reactionRole/reactionRoleMessageStore";
import { syncReactionRole } from "../../application/reactionRole/syncReactionRole";
import { noticeNewRecruit } from "../../application/recruit/noticeNewRecruit";
import { cleanupVoiceChannel } from "../../application/voice/cleanupVoiceChannel";
import { createCustomVoiceChannel } from "../../application/voice/createCustomVoiceChannel";
import { logVoiceStateChange } from "../../application/voice/logVoiceStateChange";
import { isStudentRoleChanged, STUDENT_ROLE_ID } from "../../domain/member/memberPolicy";
import { isRecruitThread } from "../../domain/recruit/recruitPolicy";
import { log, LoggerType } from "../../infrastructure/logger";
import { runSafely } from "../../infrastructure/runSafely";
import type { Actions } from "../../types/action";
import type { Command } from "../../types/command";
import { createInteractionRouter } from "../interactions/router";
import { handleReady } from "./ready";

type RegisterDeps = {
  commands: Record<string, Command>;
  actions: Actions;
};

async function handleReaction(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  mode: "add" | "remove",
): Promise<void> {
  const message = reaction.message;
  const member = message?.guild?.members.resolve(user.id);

  if (!member || !reaction.emoji.name) return;
  if (message.id !== reactionRoleMessageStore.get()) return;

  try {
    await syncReactionRole(member, reaction.emoji.name, mode);
  } catch (e) {
    log(LoggerType.ERROR, e);
  }
}

export function registerEvents(client: Client, deps: RegisterDeps): void {
  client.once("clientReady", () => handleReady(client, deps.commands));

  client.on("interactionCreate", createInteractionRouter(deps.commands, deps.actions));

  client.on("voiceStateUpdate", logVoiceStateChange);
  client.on("voiceStateUpdate", createCustomVoiceChannel);
  client.on("voiceStateUpdate", cleanupVoiceChannel);

  client.on("guildMemberAdd", (member) => grantJoinRoles(member));

  client.on("guildMemberRemove", () => updateMemberCount(client));

  client.on("threadCreate", async (thread) => {
    if (isRecruitThread(thread.parentId)) {
      log(LoggerType.INFO, "[noticeNewRecruit] Detect new Recruit");
      await runSafely("Notice new recruit thread", () => noticeNewRecruit(client, thread));
    }
  });

  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const oldHas = oldMember.roles.cache.has(STUDENT_ROLE_ID);
    const newHas = newMember.roles.cache.has(STUDENT_ROLE_ID);
    if (isStudentRoleChanged(oldHas, newHas)) {
      await updateMemberCount(client);
    }
  });

  client.on("messageReactionAdd", (reaction, user) => handleReaction(reaction, user, "add"));
  client.on("messageReactionRemove", (reaction, user) => handleReaction(reaction, user, "remove"));
}
