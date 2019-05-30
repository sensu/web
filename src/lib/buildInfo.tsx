// @ts-ignore
import info from "./buildInfo.macro";

const cache: Record<string, string> = {
  ...info,
};

export const getWebRevision = (): string => {
  return cache.webRevision;
};

export const setSensuVersion = (value: string): void => {
  cache.sensuVersion = value;
};

export const getSensuVersion = (): string | undefined => {
  return cache.sensuVersion;
};
