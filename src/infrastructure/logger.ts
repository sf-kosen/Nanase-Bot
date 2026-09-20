import toISOStringWithTimezone from "../shared/toISOStringWithTimezone";

export const enum LoggerType {
  INFO,
  WARN,
  ERROR,
}

export function log(type: LoggerType, ...args: unknown[]) {
  // ISO 8601 拡張形式の日時を取得
  const now = new Date();
  const date = toISOStringWithTimezone(now);

  switch (type) {
    case LoggerType.INFO:
      console.log(date, "[INFO ] ", ...args);
      break;

    case LoggerType.WARN:
      console.warn(date, "[WARN ] ", ...args);
      break;

    case LoggerType.ERROR:
      console.error(date, "[ERROR]", ...args);
      break;
  }
}
