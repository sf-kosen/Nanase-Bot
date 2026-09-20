import { log, LoggerType } from "./logger";

async function runSafely(label: string, task: () => Promise<void>): Promise<void> {
  try {
    await task();
  } catch (error) {
    log(LoggerType.ERROR, `[ERROR] ${label}:`, error);
  }
}

export { runSafely };
