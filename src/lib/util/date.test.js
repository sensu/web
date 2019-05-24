import {
  parseDuration,
  nanosecond,
  microsecond,
  millisecond,
  second,
  minute,
  hour,
} from "./date";

describe("date utils", () => {
  describe("parseDuration", () => {
    it("should match go time::parseDuration spec", () => {
      const parseDurationTests = [
        // simple
        ["0", true, 0],
        ["5s", true, 5 * second],
        ["30s", true, 30 * second],
        ["1478s", true, 1478 * second],
        // sign
        ["-5s", true, -5 * second],
        ["+5s", true, 5 * second],
        ["-0", true, 0],
        ["+0", true, 0],
        // decimal
        ["5.0s", true, 5 * second],
        ["5.6s", true, 5 * second + 600 * millisecond],
        ["5.s", true, 5 * second],
        [".5s", true, 500 * millisecond],
        ["1.0s", true, 1 * second],
        ["1.00s", true, 1 * second],
        ["1.004s", true, 1 * second + 4 * millisecond],
        ["1.0040s", true, 1 * second + 4 * millisecond],
        ["100.00100s", true, 100 * second + 1 * millisecond],
        // different units
        ["10ns", true, 10 * nanosecond],
        ["11us", true, 11 * microsecond],
        ["12µs", true, 12 * microsecond], // U+00B5
        ["12μs", true, 12 * microsecond], // U+03BC
        ["13ms", true, 13 * millisecond],
        ["14s", true, 14 * second],
        ["15m", true, 15 * minute],
        ["16h", true, 16 * hour],
        // composite durations
        ["3h30m", true, 3 * hour + 30 * minute],
        ["10.5s4m", true, 4 * minute + 10 * second + 500 * millisecond],
        ["-2m3.4s", true, -(2 * minute + 3 * second + 400 * millisecond)],
        [
          "1h2m3s4ms5us6ns",
          true,
          1 * hour +
            2 * minute +
            3 * second +
            4 * millisecond +
            5 * microsecond +
            6 * nanosecond,
        ],
        [
          "39h9m14.425s",
          true,
          39 * hour + 9 * minute + 14 * second + 425 * millisecond,
        ],
        // large value
        ["52763797000ns", true, 52763797000 * nanosecond],
        // more than 9 digits after decimal point, see https://golang.org/issue/6617
        ["0.3333333333333333333h", true, 20 * minute],
        // 9007199254740993 = 1<<53+1 cannot be stored precisely in a float64
        // ["9007199254740993ns", true, (1 << (53 + 1)) * nanosecond],
        // largest duration that can be represented by int64 in nanoseconds
        // ["9223372036854775807ns", true, (1 << (63 - 1)) * nanosecond],
        // ["9223372036854775.807us", true, (1 << (63 - 1)) * nanosecond],
        // ["9223372036s854ms775us807ns", true, (1 << (63 - 1)) * nanosecond],
        // large negative value
        // ["-9223372036854775807ns", true, -1 << (63 + 1 * nanosecond)],
        // huge string; issue 15011.
        ["0.100000000000000000000h", true, 6 * minute],
        // This value tests the first overflow check in leadingFraction.
        // [
        //   "0.830103483285477580700h",
        //   true,
        //   49 * minute + 48 * second + 372539827 * nanosecond,
        // ],

        // errors
        ["", false, 0],
        ["3", false, 0],
        ["-", false, 0],
        ["s", false, 0],
        [".", false, 0],
        ["-.", false, 0],
        [".s", false, 0],
        ["+.s", false, 0],
        ["3000000h", false, 0], // overflow
        ["9223372036854775808ns", false, 0], // overflow
        ["9223372036854775.808us", false, 0], // overflow
        ["9223372036854ms775us808ns", false, 0], // overflow
        // largest negative value of type int64 in nanoseconds should fail
        // see https://go-review.googlesource.com/#/c/2461/
        ["-9223372036854775808ns", false, 0],
      ];

      parseDurationTests.forEach(([input, ok, expected]) => {
        if (ok) {
          expect([input, parseDuration(input)]).toEqual([input, expected]);
        } else {
          expect(() => parseDuration(input)).toThrow();
        }
      });
    });
  });
});
