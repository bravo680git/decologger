import "reflect-metadata";
import { LOG_OPTIONS_METADATA_KEY } from "./constants";
import { LogOptions } from "./type";
import { GlobalLogger } from "./logger.global";
import { defaultFormatter } from "./helpers";

/**
 * Decorator function to log method calls and results.
 * Support logging parameters, result, execution time, and errors.
 *
 * @param options Optional configuration to override default logging behavior.
 * @returns A MethodDecorator & ClassDecorator.
 */
export function Logged(options?: LogOptions): MethodDecorator & ClassDecorator {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) => {
    if (descriptor) {
      const classOptions =
        Reflect.getMetadata(LOG_OPTIONS_METADATA_KEY, target.constructor) || {};
      const mergedOptions = { ...classOptions, ...options };
      wrapMethod(target, propertyKey as string, descriptor, mergedOptions);
    } else {
      Reflect.defineMetadata(LOG_OPTIONS_METADATA_KEY, options, target);
      const prototype = target.prototype ?? {};
      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (key) => typeof prototype[key] === "function" && key !== "constructor"
      );

      for (const methodName of methodNames) {
        const descriptor = Object.getOwnPropertyDescriptor(
          prototype,
          methodName
        );
        if (!descriptor) continue;

        const existingWrapped = Reflect.getMetadata(
          LOG_OPTIONS_METADATA_KEY,
          descriptor.value
        );
        if (!existingWrapped) {
          wrapMethod(prototype, methodName, descriptor, options);
          copyMetadata(descriptor.value, prototype[methodName]);
          Reflect.defineMetadata(
            LOG_OPTIONS_METADATA_KEY,
            options,
            descriptor.value
          );
          Object.defineProperty(prototype, methodName, descriptor);
        }
      }
    }
  };
}

function copyMetadata(original: Function, wrapped: Function) {
  const keys = Reflect.getMetadataKeys(original);
  for (const key of keys) {
    const value = Reflect.getMetadata(key, original);
    Reflect.defineMetadata(key, value, wrapped);
  }
}

/**
 * Wraps a method to log its parameters, result, execution time, and errors.
 *
 * @param target The target object that owns the method.
 * @param methodName The name of the method to be wrapped.
 * @param descriptor The property descriptor of the method.
 * @param options The logging configuration options.
 */
function wrapMethod(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor,
  options?: LogOptions
) {
  const original = descriptor.value;

  const wrapped = async function (this: any, ...args: any[]) {
    const className = target.constructor.name;
    const start = performance.now();
    const logger = options?.logger ?? GlobalLogger.get();
    const globalOptions = GlobalLogger.getOptions();
    const {
      formatter = defaultFormatter,
      logError = true,
      logExecutionTime = true,
      logResult = false,
      logParams = true,
    } = { ...globalOptions, ...options };

    try {
      const result = await original.apply(this, args);
      const duration = performance.now() - start;
      logger.log(
        formatter?.({
          className,
          methodName,
          params: logParams ? args : undefined,
          result: logResult ? result : undefined,
          duration: logExecutionTime ? duration : undefined,
        })
      );

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.log(
        formatter({
          className,
          methodName,
          params: logParams ? args : undefined,
          duration: logExecutionTime ? duration : undefined,
        })
      );
      if (logError) {
        logger.error(error);
      }
      throw error;
    }
  };

  copyMetadata(original, wrapped);

  descriptor.value = wrapped;
}
