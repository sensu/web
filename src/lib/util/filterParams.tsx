import { wrapArray } from "./array";

const separator = ":";

// Use 'brand' syntax to grant nominal typing. This enables TypeScript to
// differenciate formatted filter strings from raw string values.
//
// This pattern is one used by the TypeScript team.
// see: https://github.com/microsoft/TypeScript/blob/cd09cbbd5e5e483d5441e41d0acbcde9e868af60/src/compiler/types.ts#L1282-L1287
type Filter = string & {
  readonly brand: unique symbol;
};

export type FilterTuple = [string, string];
export type FilterMap = Record<string, string>;
export type FilterArray = Filter[];

export const parseFilter = (param: string): FilterTuple => {
  const pair = param.split(separator, 2);
  return pair.slice(0, 2) as FilterTuple;
};

export const parseFilterParams = (params: string[] | string = []): FilterMap =>
  wrapArray(params).reduce((acc: FilterMap, pair): FilterMap => {
    const [key, val] = parseFilter(pair);
    return { ...acc, [key]: val };
  }, {});

export const buildFilter = (key: string, val: string): Filter =>
  ((key + separator + val) as unknown) as Filter;

export const castFilter = (rawFilter: string): Filter =>
  buildFilter(...parseFilter(rawFilter));

export const buildFilterParams = (args: FilterMap): FilterArray => {
  const keys = Object.keys(args);
  return keys.reduce((acc: FilterArray, key): FilterArray => {
    const filter = buildFilter(key, args[key]);
    return [...acc, filter];
  }, []);
};

type Toggle = (val: string | null) => void;
export type ToggleSetter = (params: any) => unknown;
export const toggleParam = (key: string, setter: ToggleSetter): Toggle => (
  val,
): void => {
  setter(
    (params: FilterMap): FilterMap => {
      if (val === null || params[key] === val) {
        const { [key]: _, ...rest } = params;
        return rest;
      }
      return { ...params, [key]: val };
    },
  );
};
