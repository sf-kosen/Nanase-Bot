import { log, LoggerType } from "./logger";

export default async function runSafely(label: string, task: () => Promise<void>): Promise<void> {
  try {
    await task();
  } catch (error) {
    log(LoggerType.ERROR, `[ERROR] ${label}:`, error);
  }
}
