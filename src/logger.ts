import { LOG_LEVEL } from "./constants";
import { ILogger, LogLevel } from "./type";

export class Logger implements ILogger {
  private enabledLevels: Set<LogLevel>;
  private readonly timestampFormat: Intl.DateTimeFormat;

  private readonly colors: Record<LogLevel, string> = {
    [LOG_LEVEL.FATAL]: "\x1b[31;1m",
    [LOG_LEVEL.ERROR]: "\x1b[31m",
    [LOG_LEVEL.WARN]: "\x1b[33m",
    [LOG_LEVEL.LOG]: "\x1b[37m",
    [LOG_LEVEL.DEBUG]: "\x1b[36m",
    [LOG_LEVEL.VERBOSE]: "\x1b[90m",
  };
  private readonly resetColor: string = "\x1b[0m";

  constructor() {
    this.enabledLevels = new Set([
      LOG_LEVEL.FATAL,
      LOG_LEVEL.ERROR,
      LOG_LEVEL.WARN,
      LOG_LEVEL.LOG,
      LOG_LEVEL.DEBUG,
      LOG_LEVEL.VERBOSE,
    ]);
    this.timestampFormat = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  private formatMessage(
    level: LogLevel,
    message: any,
    ...optionalParams: any[]
  ): string {
    const timestamp = this.timestampFormat
      .format(new Date())
      .replace(/,/, "")
      .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");
    const msgStr = this.stringifyMessage(message);
    const paramsStr = optionalParams.map(this.stringifyMessage).join(" ");
    const color = this.colors[level] || "";
    return `${color}[${timestamp}] ${level}: ${msgStr}${
      paramsStr ? " " + paramsStr : ""
    }${this.resetColor}`;
  }

  private stringifyMessage(message: any): string {
    if (message instanceof Error) {
      return `${message.message}\n${message.stack || ""}`;
    }
    if (typeof message === "object" && message !== null) {
      try {
        return JSON.stringify(message);
      } catch {
        return String(message);
      }
    }
    return String(message);
  }

  log(message: any, ...optionalParams: any[]): void {
    if (this.enabledLevels.has(LOG_LEVEL.LOG)) {
      console.log(
        this.formatMessage(LOG_LEVEL.LOG, message, ...optionalParams)
      );
    }
  }

  error(message: any, ...optionalParams: any[]): void {
    if (this.enabledLevels.has(LOG_LEVEL.ERROR)) {
      console.error(
        this.formatMessage(LOG_LEVEL.ERROR, message, ...optionalParams)
      );
    }
  }

  warn(message: any, ...optionalParams: any[]): void {
    if (this.enabledLevels.has(LOG_LEVEL.WARN)) {
      console.warn(
        this.formatMessage(LOG_LEVEL.WARN, message, ...optionalParams)
      );
    }
  }

  debug(message: any, ...optionalParams: any[]): void {
    if (this.enabledLevels.has(LOG_LEVEL.DEBUG)) {
      console.debug(
        this.formatMessage(LOG_LEVEL.DEBUG, message, ...optionalParams)
      );
    }
  }

  verbose(message: any, ...optionalParams: any[]): void {
    if (this.enabledLevels.has(LOG_LEVEL.VERBOSE)) {
      console.log(
        this.formatMessage(LOG_LEVEL.VERBOSE, message, ...optionalParams)
      );
    }
  }

  fatal(message: any, ...optionalParams: any[]): void {
    if (this.enabledLevels.has(LOG_LEVEL.FATAL)) {
      console.error(
        this.formatMessage(LOG_LEVEL.FATAL, message, ...optionalParams)
      );
    }
  }

  setLogLevels(levels: LogLevel[]): void {
    this.enabledLevels = new Set(levels);
  }
}
