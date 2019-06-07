type Param = string | string[] | undefined;

export function parseStringParam(param: Param): string | undefined;
export function parseStringParam<T>(param: Param, defaultVal: T): string | T;
export function parseStringParam(
  param: Param,
  defaultVal = undefined,
): string | undefined {
  if (typeof param === "string") {
    return param;
  }

  if (Array.isArray(param)) {
    return parseStringParam(param[0], defaultVal);
  }

  return defaultVal;
}

export function parseIntParam(param: Param): number | undefined;
export function parseIntParam<T>(param: Param, defaultVal: T): number | T;
export function parseIntParam(
  param: Param,
  defaultVal = undefined,
): number | undefined {
  if (typeof param === "string") {
    const val = parseInt(param, 10);
    if (Number.isNaN(val)) {
      return defaultVal;
    }
    return val;
  }

  if (Array.isArray(param)) {
    return parseIntParam(param[0], defaultVal);
  }

  return defaultVal;
}

export function parseArrayParam(param: Param): string[] {
  if (typeof param === "string") {
    return [param];
  }

  if (Array.isArray(param)) {
    return param;
  }

  return [];
}
