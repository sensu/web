/* eslint-disable no-nested-ternary */
import cronstrue from "cronstrue";
import { parseDuration, second, minute, hour, day } from "./date";

interface FormatOptions {
  throwExceptionOnParseError?: boolean;
  verbose?: boolean;
  dayOfWeekStartIndexZero?: boolean;
  use24HourTimeFormat?: boolean;
  locale?: string;
}

export const extractTz = (expression: string): [string, string | undefined] => {
  let expr = expression.trim();
  let locale;
  if (/^(TZ|CRON_TZ)=[^\s]+\s+/.test(expr)) {
    const i = expr.indexOf(" ");
    const eq = expr.indexOf("=");
    locale = expr.slice(eq + 1, i);
    expr = expr.slice(i).trim();
  }
  return [expr, locale];
};

export const normalize = (expression: string) => {
  const [expr] = extractTz(expression);

  if (/^@(yearly|annually)$/.test(expr)) {
    return "0 0 0 1 1 *";
  }

  if (/^@monthly$/.test(expr)) {
    return "0 0 0 1 * *";
  }

  if (/^@weekly$/.test(expr)) {
    return "0 0 0 * * 0";
  }

  if (/^@(daily|midnight)$/.test(expr)) {
    return "0 0 0 * * *";
  }

  if (/^@hourly$/.test(expr)) {
    return "0 0 * * * *";
  }

  const match = /^@every +(.*)$/.exec(expr);
  if (match) {
    // Parse the duration in ms rounded to the nearest second
    const duration = Math.round(parseDuration(match[1]) / second) * second;

    if (duration > 0) {
      if (duration % day === 0) {
        return `0 0 0 */${duration / day} * *`;
      }

      if (duration % hour === 0) {
        return `0 0 */${duration / hour} * * *`;
      }

      if (duration % minute === 0) {
        return `0 */${duration / minute} * * * *`;
      }
    }

    const seconds = duration / second;

    if (seconds > 0) {
      return `*/${seconds} * * * * *`;
    }

    return `* * * * * *`;
  }

  return expr;
};

export const format = (expression: string, options: FormatOptions = {}) => {
  return cronstrue.toString(normalize(expression), options);
};
