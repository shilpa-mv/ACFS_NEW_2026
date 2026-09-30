type Level = "debug" | "info" | "warn" | "error";
const weight: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = weight[(process.env.LOG_LEVEL as Level) ?? "info"] ?? weight.info;

function write(level: Level, message: string): void {
  if (weight[level] < threshold) return;
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`;
  (level === "error" ? console.error : console.log)(line);
}

export class Logger {
  static debug(message: string): void { write("debug", message); }
  static info(message: string): void { write("info", message); }
  static warn(message: string): void { write("warn", message); }
  static error(message: string): void { write("error", message); }
}
