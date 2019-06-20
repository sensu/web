import { validName, validSubscriptionName } from "./validator";

describe("validator utils", () => {
  test("validName", () => {
    expect(validName("")).toBe(false);
    expect(validName("foo bar")).toBe(false);
    expect(validName("foo@bar")).toBe(false);
    expect(validName("foo-bar")).toBe(true);
  });
  test("validSubscriptionName", () => {
    expect(validSubscriptionName("")).toBe(false);
    expect(validSubscriptionName("foo bar")).toBe(false);
    expect(validSubscriptionName("foo@bar")).toBe(false);
    expect(validSubscriptionName("entity:foo:bar")).toBe(false);
    expect(validSubscriptionName("entity:foo")).toBe(true);
    expect(validSubscriptionName("foo-bar_2")).toBe(true);
  });
});
