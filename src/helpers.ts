import { LogParams } from "./type";

export function defaultFormatter({
  className,
  methodName,
  params = [],
  result,
  duration,
}: LogParams) {
  let logMessage = `[${className}.${methodName}]`;

  if (typeof duration === "number") {
    logMessage += `- execute in ${duration.toFixed(2)}ms`;
  }

  if (params.length) {
    logMessage += `\n\tparams: ${JSON.stringify(params)}`;
  }

  if (result !== undefined) {
    logMessage += `\n\tresult: ${JSON.stringify(result)}`;
  }
  return logMessage;
}
