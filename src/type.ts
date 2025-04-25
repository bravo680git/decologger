import { Logger } from "@nestjs/common";

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
  logger?: Logger;
};
