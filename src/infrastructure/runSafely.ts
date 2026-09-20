import { log, LoggerType } from "./logger";

export async function runSafely(label: string, task: () => Promise<void>): Promise<void> {
  try {
    await task();
  } catch (error) {
    log(LoggerType.ERROR, `[ERROR] ${label}:`, error);
  }
}
