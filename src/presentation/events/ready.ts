import type { Client } from "discord.js";
import { prefetchMembers } from "../../application/member/prefetchMembers";
import { updateMemberCount } from "../../application/member/updateMemberCount";
import { ensureReactionRoleMessage } from "../../application/reactionRole/ensureReactionRoleMessage";
import { reactionRoleMessageStore } from "../../application/reactionRole/reactionRoleMessageStore";
import { logger } from "../../infrastructure/logger";
import { runSafely } from "../../infrastructure/runSafely";
import type { Command } from "../../types/command";

async function handleReady(client: Client, commands: Record<string, Command>): Promise<void> {
  logger.info(`Logged in as ${client.user?.tag}`);

  await runSafely("Registering commands", async () => {
    const data = Object.values(commands).map((command) => {
      logger.warn(`  Registering command: ${command.data.name}`);
      return command.data;
    });
    await client.application?.commands.set(data as never);
    logger.info("Commands registered successfully!");
  });

  logger.info("Bot is ready!");

  await runSafely("Initial member count update", () => updateMemberCount(client));
  await runSafely("Client member cache create", () => prefetchMembers(client));

  await runSafely("Reaction role message check", async () => {
    const result = await ensureReactionRoleMessage(client);
    if (!result) {
      logger.error("This channel can't send msg");
      return;
    }
    reactionRoleMessageStore.set(result);
  });

  await runSafely("Setting bot activity", async () => {
    client.user?.setActivity("with Discord.js", { type: 0 });
  });
}

export { handleReady };
