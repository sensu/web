import { wrapArray } from "./array";

const separator = ":";

export const parseFilter = param => {
  const pair = param.split(separator, 2);
  return pair.slice(0, 2);
};

export const parseFilterParams = (params = []) =>
  wrapArray(params).reduce((acc, pair) => {
    const [key, val] = parseFilter(pair);
    return { ...acc, [key]: val };
  }, {});

export const buildFilter = (key, val) => key + separator + val;

export const buildFilterParams = args => {
  const keys = Object.keys(args);
  return keys.reduce((acc, key) => {
    const filter = buildFilter(key, args[key]);
    return [...acc, filter];
  }, []);
};

export const toggleParam = (key, setter) => val => {
  setter(params => {
    if (val === null || params[key] === val) {
      delete params[key]; // eslint-disable-line no-param-reassign
      return params;
    }
    return { ...params, [key]: val };
  });
};
