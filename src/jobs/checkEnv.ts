import { env } from "./../configs/env";

export default function checkEnv(): boolean {
  let isPass: boolean = true;

  if (!env.channelID.memberCount) {
    console.error("[checkEnv] MEMBERCOUNT_CHANNEL_ID is not set");
    isPass = false;
  }

  if (!env.channelID.reactionRole) {
    console.error("[checkEnv] REACTIONROLE_CHANNEL_ID is not set");
    isPass = false;
  }

  if (!env.channelID.recruitNotice) {
    console.error("[checkEnv] RECRUITNOTICE_CHANNEL_ID is not set");
    isPass = false;
  }

  if (!env.info.botID) {
    console.error("[checkEnv] BOT_ID is not set");
    isPass = false;
  }

  if (!env.info.guildID) {
    console.error("[checkEnv] GUILD_ID is not set");
    isPass = false;
  }

  if (!env.role_id.bot) {
    console.error("[checkEnv] BOT_ROLE_ID is not set");
    isPass = false;
  }

  if (!env.role_id.notifier) {
    console.error("[checkEnv] NOTIFIER_ROLE_ID is not set");
    isPass = false;
  }

  if (!env.role_id.student) {
    console.error("[checkEnv] STUDENT_ROLE_ID is not set");
    isPass = false;
  }

  if (!env.role_id.term) {
    console.error("[checkEnv] TERM_ROLE_ID is not set");
    isPass = false;
  }

  if (!env.role_id.vc) {
    console.error("[checkEnv] VC_ROLE_ID is not set");
    isPass = false;
  }

  if (!env.token.discord) {
    console.error("[checkEnv] DISCORD_TOKEN is not set");
    isPass = false;
  }

  return isPass;
}
