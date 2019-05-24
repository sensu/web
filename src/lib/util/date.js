export const parseUNIX = timestamp => new Date(timestamp * 1000);

const monthNameFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
export const getMonthName = date => monthNameFormatter.format(date);

const timeZoneNameFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  timeZoneName: "short",
});
export const getTimeZoneName = date => {
  const parts = timeZoneNameFormatter.formatToParts(date);

  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (parts[i].type === "timeZoneName") {
      return parts[i].value;
    }
  }

  return "";
};

const hourFormatter = new Intl.DateTimeFormat("en-us", { hour: "numeric" });
export const getHour = date => {
  const parts = hourFormatter.formatToParts(date);

  for (let i = 0; i < parts.length; i += 1) {
    if (parts[i].type === "hour") {
      return parts[i].value;
    }
  }

  return "";
};

export const getDayperiod = date => {
  const parts = hourFormatter.formatToParts(date);

  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (parts[i].type === "dayperiod" || parts[i].type === "dayPeriod") {
      return parts[i].value;
    }
  }

  return "";
};

export const millisecond = 1;
export const microsecond = millisecond / 1000;
export const nanosecond = microsecond / 1000;
export const second = 1000 * millisecond;
export const minute = 60 * second;
export const hour = 60 * minute;
export const day = 24 * hour;

export const unitMap = {
  ns: nanosecond,
  us: microsecond,
  µs: microsecond, // U+00B5 = micro symbol
  μs: microsecond, // U+03BC = Greek letter mu
  ms: millisecond,
  s: second,
  m: minute,
  h: hour,
};

export const parseDuration = original => {
  let string = original;
  let duration = 0;
  let negative = false;

  // Consume [-+]?
  if (string !== "") {
    const match = /^[-+]/.exec(string);
    if (match) {
      if (match[0] === "-") {
        negative = true;
      }
      string = string.slice(match[0].length);
    }
  }

  // Special case: if all that is left is "0", this is zero.
  if (string === "0") {
    return 0;
  }

  if (string === "") {
    throw new TypeError(`invalid duration ${original}`);
  }

  let consumedLength = 0;

  const consumeInt = () => {
    const match = /^[0-9]+/.exec(string);
    if (match) {
      consumedLength = match[0].length;
      string = string.slice(consumedLength);
      return parseInt(match[0], 10);
    }

    consumedLength = 0;
    return 0;
  };

  const consumeFraction = () => {
    const match = /^[0-9]+/.exec(string);
    if (match) {
      consumedLength = match[0].length;
      string = string.slice(consumedLength);
      const scale = 10 ** consumedLength;
      return [parseInt(match[0], 10), scale];
    }

    consumedLength = 0;
    return [0, 1];
  };

  const consumeDecimal = () => {
    const match = /^\./.exec(string);
    if (match) {
      consumedLength = match[0].length;
      string = string.slice(consumedLength);
      return true;
    }

    consumedLength = 0;
    return false;
  };

  const consumeUnit = () => {
    const match = /^[^0-9.]*/.exec(string);
    if (match) {
      consumedLength = match[0].length;
      string = string.slice(consumedLength);

      return match[0];
    }

    consumedLength = 0;
    return "";
  };

  while (string !== "") {
    // The next character must be [0-9.]
    if (!/^[0-9.]/.test(string)) {
      throw new TypeError(`time: invalid duration ${original}`);
    }

    const digit = consumeInt();
    const hasDigit = consumedLength > 0;

    const hasDecimal = consumeDecimal();

    const [[fraction, scale], hasFraction] = hasDecimal
      ? [consumeFraction(), consumedLength > 0]
      : [[0, 1], false];

    if (!hasDigit && !hasFraction) {
      throw new TypeError(`time: invalid duration ${original}`);
    }

    const unitName = consumeUnit();

    if (!unitName) {
      throw new TypeError(`time: missing unit in duration ${original}`);
    }

    const unit = unitMap[unitName];

    if (!unit) {
      throw new TypeError(
        `time: unknown unit ${unitName} in duration ${original}`,
      );
    }

    let value = digit * unit;

    if (fraction > 0) {
      value += fraction * (unit / scale);
    }

    duration += value;
  }

  return negative ? -duration : duration;
};
