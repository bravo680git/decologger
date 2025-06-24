import { Logger } from "./logger";
import { GlobalLogger } from "./logger.global";
import { LogOptions } from "./type";

describe("GlobalLogger", () => {
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;
  });

  it("should use default logger if none injected", () => {
    const defaultLogger = GlobalLogger.get();
    expect(defaultLogger).toBeInstanceOf(Logger);
  });

  it("should inject a custom logger", () => {
    GlobalLogger.inject(mockLogger);
    const logger = GlobalLogger.get();

    expect(logger).toBe(mockLogger);
  });

  it("should configure global options", () => {
    const options: LogOptions = {
      logParams: true,
      logResult: true,
    };

    GlobalLogger.config(options);
    const globalOptions = GlobalLogger.getOptions();

    expect(globalOptions).toEqual(options);
  });

  it("should log using custom logger", async () => {
    GlobalLogger.inject(mockLogger);

    const logger = GlobalLogger.get();
    logger.log("Test message");
    expect(mockLogger.log).toHaveBeenCalledWith("Test message");
  });
});
