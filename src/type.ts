import { LOG_LEVEL } from "./constants";

export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];
export interface ILogger {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]): any;
  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]): any;
  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]): any;
  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]): any;
  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]): any;
  /**
   * Write a 'fatal' level log.
   */
  fatal?(message: any, ...optionalParams: any[]): any;
  /**
   * Set log levels.
   * @param levels log levels
   */
  setLogLevels?(levels: LogLevel[]): any;
}

/**
 * Represents the data passed into the formatter function when logging.
 */
export type LogParams = {
  /** Name of the class that owns the method */
  className: string;

  /** Name of the method being called */
  methodName: string;

  /** Array of arguments passed to the method */
  params?: any[];

  /** The return value of the method (if successful) */
  result?: any;

  /** Execution time in milliseconds */
  duration?: number;
};

/**
 * Configuration options for the logging behavior.
 */
export type LogOptions = {
  /**
   * Whether to log the method parameters.
   * @default true
   */
  logParams?: boolean;

  /**
   * Whether to log the return value of the method.
   * @default false
   */
  logResult?: boolean;

  /**
   * Whether to log the error (if thrown).
   * @default true
   */
  logError?: boolean;

  /**
   * Whether to log the method execution time.
   * @default true
   */
  logExecutionTime?: boolean;

  /**
   * Custom formatter function to format log messages.
   * Accepts `LogParams` and returns a string message.
   */
  formatter?: (data: LogParams) => string;

  /**
   * Custom logger instance to override the default global logger.
   */
  logger?: ILogger;
};
