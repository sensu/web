export const SEPARATOR = ":";

// Use 'brand' syntax to grant nominal typing. This enables TypeScript to
// differenciate formatted filter strings from raw string values.
//
// This pattern is one used by the TypeScript team.
// see: https://github.com/microsoft/TypeScript/blob/cd09cbbd5e5e483d5441e41d0acbcde9e868af60/src/compiler/types.ts#L1282-L1287
type Filter = string & {
  readonly brand: unique symbol;
};

// TODO: Define FilterParamKey as an enum or union to check that filter keys
// are correct wherever referenced
export type FilterParamKey = string;
export type FilterParam = string;
export type FilterTuple = [string, string];
export type FilterParamMap = { readonly [K in FilterParamKey]?: FilterParam };

export const parseFilter = (param: string): FilterTuple => {
  const [key, val] = param.split(SEPARATOR, 2);
  return [key, val];
};

export const parseFilterParams = (
  filters: string[] | string,
): FilterParamMap => {
  const map = {};

  const filterArray = Array.isArray(filters)
    ? filters
    : filters
    ? [filters]
    : [];

  filterArray.forEach((pair) => {
    const [key, val] = parseFilter(pair);

    if (key && val) {
      map[key] = val;
    } else if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`removed invalid filter pair ${key}:${val}`);
    }
  }, {});

  return map;
};

export const buildFilter = (key: string, val: string): Filter =>
  ((key + SEPARATOR + val) as unknown) as Filter;

export const buildFilterParams = (args: FilterParamMap): Filter[] => {
  const filters: Filter[] = [];

  Object.keys(args).forEach((key) => {
    const val = args[key];

    if (key && val) {
      filters.push(buildFilter(key, val));
    } else if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`ignored invalid filter pair ${key}:${val}`);
    }
  });

  return filters;
};

function omit<T extends {}, K extends string>(key: K, target: T): Omit<T, K> {
  const { [key]: _, ...rest } = target;
  return rest;
}

/*
 * toggleParam creates a bound update function for a given filter. It is
 * designed to be used in conjunction with the `setFilters` function returned
 * from the `useFilters` hook
 *
 * example with a given filter `foo` which can either be "true" or not present:
 *
 * import {useFilters} from "/lib/component/util";
 * import {toggleParam} from "/lib/util/filterParam";
 *
 * const FooFilterCheckbox = () => {
 *   const [filters, setFilters] = useFilters();
 *
 *   return (
 *     <input
 *       type="checkbox"
 *       checked={filters.foo === "true"}
 *       onChange={() => toggleParam("foo", setFilters)("true")}
 *     />
 * };
 *
 * calling `toggleParam("foo", setFilters)("true")` will toggle the `foo` filter
 * between "true" and removing it.
 *
 * calling `toggleParam("foo", setFilters)(null)` will remove it.
 */
export const toggleParam = (
  key: string,
  setFilters: (update: (prevFilters: FilterParamMap) => FilterParamMap) => void,
): ((val?: string | null) => void) => (val) => {
  setFilters(
    (prevFilters: FilterParamMap): FilterParamMap => {
      if (val === null || prevFilters[key] === val) {
        return omit(key, prevFilters);
      }

      return { ...prevFilters, [key]: val };
    },
  );
};
