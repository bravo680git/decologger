import { Logger } from "./logger";
import { LogOptions, ILogger } from "./type";

/**
 * Utility class that provides a centralized logger
 * for the entire application. It allows configuring global logging options
 * and injecting a custom logger instance.
 *
 * The logger can be accessed globally for logging purposes, and it supports
 * configuration of options such as logging format, error logging, and more.
 */
export class GlobalLogger {
  private static _logger: ILogger;
  private static _options?: LogOptions;

  /**
   * Injects a custom logger instance into the GlobalLogger.
   * This allows using a specific logger throughout the application.
   *
   * @param logger The custom logger instance to be used globally.
   * @returns GlobalLogger.
   */
  static inject(logger: ILogger) {
    GlobalLogger._logger = logger;
    return GlobalLogger;
  }

  /**
   * Configures global logging options for all loggers in the application.
   *
   * @param options The logging options.
   * @returns void
   */
  static config(options?: Omit<LogOptions, "logger">) {
    GlobalLogger._options = options;
  }

  /**
   * Retrieves the current logger instance. If no logger has been injected,
   * a default `Logger` instance is used.
   *
   * @returns Logger.
   */
  static get() {
    return GlobalLogger._logger ?? new Logger();
  }

  /**
   * Retrieves the global logging configuration options.
   *
   * @returns The global logging options.
   */
  static getOptions() {
    return GlobalLogger._options;
  }
}
