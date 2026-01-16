type LogSeverity = "log" | "info" | "warn" | "error" | "debug";
type Logger = typeof logger;

const nativeConsole = console;

const createLog =
  (method: LogSeverity) =>
  (...args: unknown[]) => {
    const uuid = crypto.randomUUID();
    nativeConsole[method](`[${uuid}]`, ...args);
    return uuid;
  };

const logger = {
  log: createLog("log"),
  info: createLog("info"),
  warn: createLog("warn"),
  error: createLog("error"),
  debug: createLog("debug"),
};

export { type LogSeverity, type Logger, logger };
