import { logger } from "./logger";

async function runSafely(label: string, task: () => Promise<void>): Promise<void> {
  try {
    await task();
  } catch (error) {
    logger.error(`[ERROR] ${label}:`, error);
  }
}

export { runSafely };
