import { Logged } from "./logger.decorator";
import { GlobalLogger } from "./logger.global";
import { Logger } from "@nestjs/common";

describe("Logged decorator", () => {
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;

    GlobalLogger.inject(mockLogger);
  });

  it("should log all methods when put decorator on class", () => {
    @Logged({ formatter: ({ methodName }) => methodName })
    class TestClass {
      method1() {
        return "Method 1";
      }
      method2() {
        return "Method 2";
      }
    }

    const instance = new TestClass();
    instance.method1();
    expect(mockLogger.log).toHaveBeenCalledWith("method1");
    instance.method2();
    expect(mockLogger.log).toHaveBeenCalledWith("method2");
  });

  it("should log method execution with params", async () => {
    class TestClass {
      @Logged({ formatter: ({ params }) => `${JSON.stringify(params)}` })
      async testMethod(param1: string, param2: number) {
        return `Hello ${param1} ${param2}`;
      }
    }

    const instance = new TestClass();
    await instance.testMethod("World", 42);

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('["World",42]')
    );
  });

  it("should log method execution result", async () => {
    class TestClass {
      @Logged({ logResult: true, formatter: ({ result }) => result })
      async testMethod() {
        return "Test result";
      }
    }

    const instance = new TestClass();
    await instance.testMethod();

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining("Test result")
    );
  });

  it("should log error if method throws an exception", async () => {
    class TestClass {
      @Logged()
      async testMethod() {
        throw new Error("Test error");
      }
    }

    const instance = new TestClass();
    try {
      await instance.testMethod();
    } catch (error) {
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    }
  });
});
