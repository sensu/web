// @flow

// $ExpectError
import info from "./buildInfo.macro";

const cache = {
  ...info,
};

export const getWebRevision = (): string => {
  return cache.webRevision;
};

export const setSensuVersion = (value: string) => {
  cache.sensuVersion = value;
};

export const getSensuVersion = (): string => {
  return cache.sensuVersion;
};
