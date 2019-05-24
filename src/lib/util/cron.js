/* eslint-disable no-nested-ternary */
import cronstrue from "cronstrue";
import { parseDuration, second, minute, hour, day } from "./date";

export const normalize = expression => {
  if (/^@(yearly|annually)$/.test(expression)) {
    return "0 0 0 1 1 *";
  }

  if (/^@monthly$/.test(expression)) {
    return "0 0 0 1 * *";
  }

  if (/^@weekly$/.test(expression)) {
    return "0 0 0 * * 0";
  }

  if (/^@(daily|midnight)$/.test(expression)) {
    return "0 0 0 * * *";
  }

  if (/^@hourly$/.test(expression)) {
    return "0 0 * * * *";
  }

  const match = /^@every +(.*)$/.exec(expression);
  if (match) {
    const duration = parseDuration(match[1]);

    if (duration % day === 0) {
      return `0 0 0 */${duration / day} * *`;
    }

    if (duration % hour === 0) {
      return `0 0 */${duration / hour} * * *`;
    }

    if (duration % minute === 0) {
      return `0 */${duration / minute} * * * *`;
    }

    const seconds = Math.round(duration / second);

    if (seconds) {
      return `*/${seconds} * * * * *`;
    }

    return `* * * * * *`;
  }

  return expression;
};

export const format = (expression, options) =>
  cronstrue.toString(normalize(expression), options);
