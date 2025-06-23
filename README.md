# decologger

A lightweight, pluggable logger decorator for NestJS.

## 🔧 Installation

```bash
pnpm i decologger
```

## 📦 Features

✅ Logs method input, output, errors, and duration

✅ Supports both class and method decorators

✅ Global configuration

✅ Custom logger instance per decorator

✅ Custom formatter function

✅ Metadata-based deduplication

## 🚀 Usage

- Basic Logging

```ts
import { Logged } from "decologger";

@Injectable()
class UserService {
  @Logged()
  getUsers() {
    return ["Alice", "Bob"];
  }
}
```

- Class-level Logging

```ts
@Logged()
@Injectable()
class UserService {
getUsers() { ... }
createUser() { ... }
}
```

- Custom Options

```ts
@Logged({ logParams: false, logResult: true })
getUser(id: string) {
return this.users.find(u => u.id === id);
}
```

- Global Logger instance & config

  Can use any 3rt Logger instance like: winston, pino,... or nestJS Logger

```ts
// main.ts
import { GlobalLogger } from "decologger";
import { Logger } from "@nestjs/common";

GlobalLogger.inject(new Logger("AppLogger")).config({
  logExecutionTime: true,
  logResult: true,
  formatter: ({ className, methodName }) =>
    `[${className}]::${methodName}() called`,
});
```

- Override Logger instance for a scpecific method

```ts
@Logged({ logger: new Logger("Custom") })
doSomething() { ... }
```

## 🧩 API

### `LogOptions`

Defines options you can pass to `@Logged()` to control what gets logged and how.

```ts
export type LogOptions = {
  logParams?: boolean; // default: true — Log method arguments
  logResult?: boolean; // default: false — Log return value
  logError?: boolean; // default: true — Log error if thrown
  logExecutionTime?: boolean; // default: true — Log execution duration
  formatter?: (data: LogParams) => string; // Custom formatter for log output
  logger?: Logger; // Optional custom logger instance
};
```

### `LogParams`

Structure of data passed into the formatter function. You can use this to fully customize log output.

```ts
export type LogParams = {
  className: string; // Name of the class containing the method
  methodName: string; // Name of the method being logged
  params?: any[]; // Arguments passed to the method
  result?: any; // Result returned by the method
  duration?: number; // Time (in ms) the method took to run
};
```

💡 Tip: You can create a custom formatter like this:

```ts
const customFormatter = ({ className, methodName, duration }: LogParams) =>
  `[${className}.${methodName}] took ${duration?.toFixed(1)}ms`;

@Logged({ formatter: customFormatter })
someMethod() { ... }
```

## 📄 License

MIT
