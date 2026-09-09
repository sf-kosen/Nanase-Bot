import { env } from "./../configs/env";

export default function checkEnv(): boolean {
  let isPass: boolean = true;

  if (!env.role_id.notifier) {
    console.log("[checkEnv] NOTIFIER_ROLE_ID is not set");
    isPass = false;
  }

  if (!env.role_id.vc) {
    console.error("[checkEnv] VC_ROLE_ID is not set");
    isPass = false;
  }

  return isPass;
}
