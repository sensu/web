import { normalize, format, extractTz } from "./cron";

describe("cron utils", () => {
  describe("extractTz", () => {
    it("should return both TZ and truncated expression", () => {
      expect(extractTz("TZ=Asia/Tokyo * * * * *")).toEqual([
        "* * * * *",
        "Asia/Tokyo",
      ]);
      expect(extractTz("CRON_TZ=Asia/Tokyo * * * * *")).toEqual([
        "* * * * *",
        "Asia/Tokyo",
      ]);
      expect(extractTz("           CRON_TZ=Asia/Tokyo  * * * * *")).toEqual([
        "* * * * *",
        "Asia/Tokyo",
      ]);
      expect(extractTz("* * * * *")).toEqual(["* * * * *", undefined]);
    });
  });

  describe("normalize", () => {
    it("should convert non-standard expressions to standard format", () => {
      expect(normalize("TZ=Asia/Tokyo * * * * *")).toEqual("* * * * *");
      expect(normalize("CRON_TZ=Asia/Tokyo * * * * *")).toEqual("* * * * *");

      expect(normalize("@yearly")).toEqual("0 0 0 1 1 *");
      expect(normalize("@annually")).toEqual("0 0 0 1 1 *");
      expect(normalize("@monthly")).toEqual("0 0 0 1 * *");
      expect(normalize("@daily")).toEqual("0 0 0 * * *");
      expect(normalize("@midnight")).toEqual("0 0 0 * * *");
      expect(normalize("@hourly")).toEqual("0 0 * * * *");

      expect(normalize("@every 48h")).toEqual("0 0 0 */2 * *");
      expect(normalize("@every 5h")).toEqual("0 0 */5 * * *");
      expect(normalize("@every 5m")).toEqual("0 */5 * * * *");
      expect(normalize("@every 1h5m")).toEqual("0 */65 * * * *");
      expect(normalize("@every 5s")).toEqual("*/5 * * * * *");
      expect(normalize("@every 900ms")).toEqual("*/1 * * * * *");
      expect(normalize("@every 5ms")).toEqual("* * * * * *");
      expect(normalize("@every 5000000000ns")).toEqual("*/5 * * * * *");
      // 59.9 seconds should be parsed to equal 1 minute
      expect(normalize("@every 59900ms")).toEqual("0 */1 * * * *");
      expect(normalize("@every 59.9s")).toEqual("0 */1 * * * *");

      expect(normalize("not a valid expression")).toEqual(
        "not a valid expression",
      );

      expect(() => normalize("@every not a valid duration")).toThrow();
    });
  });

  describe("format", () => {
    it("should correctly format non-standard expressions", () => {
      expect(format("TZ=Asia/Tokyo * * * * *")).toEqual("Every minute");
      expect(format("CRON_TZ=Asia/Tokyo * * * * *")).toEqual("Every minute");

      expect(format("@yearly")).toEqual(
        "At 12:00 AM, on day 1 of the month, only in January",
      );
      expect(format("@annually")).toEqual(
        "At 12:00 AM, on day 1 of the month, only in January",
      );
      expect(format("@monthly")).toEqual("At 12:00 AM, on day 1 of the month");
      expect(format("@daily")).toEqual("At 12:00 AM");
      expect(format("@midnight")).toEqual("At 12:00 AM");
      expect(format("@hourly")).toEqual("Every hour");

      expect(format("@every 59.9s")).toEqual("Every minute");
      expect(format("@every 59900ms")).toEqual("Every minute");
      expect(format("@every 5000000000ns")).toEqual("Every 5 seconds");
      expect(format("@every 5ms")).toEqual("Every second");
      expect(format("@every 5s")).toEqual("Every 5 seconds");
      expect(format("@every 5m")).toEqual("Every 5 minutes");
      expect(format("@every 1h5m")).toEqual("Every 65 minutes");
      expect(format("@every 4h")).toEqual(
        "At 0 minutes past the hour, every 4 hours",
      );
      expect(format("@every 24h")).toEqual("At 12:00 AM");
      expect(format("@every 48h")).toEqual("At 12:00 AM, every 2 days");

      expect(() => format("not a valid expression")).toThrow();
    });
  });
});
