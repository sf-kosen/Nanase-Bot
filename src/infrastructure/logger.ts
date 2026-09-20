const enum LoggerType {
  INFO,
  WARN,
  ERROR,
}

export default function log(type: LoggerType, ...args: unknown[]) {
  switch (type) {
    case LoggerType.INFO:
      console.log("[INFO ] ", ...args);
      break;

    case LoggerType.WARN:
      console.warn("[WARN ] ", ...args);
      break;

    case LoggerType.ERROR:
      console.error("[ERROR]", ...args);
      break;
  }
}
