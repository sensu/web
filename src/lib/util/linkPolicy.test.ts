import shouldAllowLink from "./linkPolicy";
import newURL from "./url";

const u = (v: string) => newURL(v);

describe("shouldAllowLink", () => {
  test("allow list > protocol relative should allow any", () => {
    const policy = { allowList: true, URLs: ["//google.com"] };
    expect(shouldAllowLink(policy, u("https://google.com"))).toBe(true);
    expect(shouldAllowLink(policy, u("http://google.com"))).toBe(true);
    expect(shouldAllowLink(policy, u("steamid://google.com"))).toBe(true);
    expect(shouldAllowLink(policy, u("//google.com"))).toBe(true);
  });

  test("allow list > should match specific protocol", () => {
    const policy = { allowList: true, URLs: ["https://google.com"] };
    expect(shouldAllowLink(policy, u("https://google.com"))).toBe(true);
    expect(shouldAllowLink(policy, u("http://google.com"))).toBe(false);
    expect(shouldAllowLink(policy, u("steamid://google.com"))).toBe(false);
    expect(shouldAllowLink(policy, u("//google.com"))).toBe(false);
  });

  test("allow list > should match domain with glob", () => {
    const policy = { allowList: true, URLs: ["//*google.com"] };
    expect(shouldAllowLink(policy, u("https://google.com"))).toBe(true);
    expect(shouldAllowLink(policy, u("http://www.google.com"))).toBe(true);
    expect(shouldAllowLink(policy, u("http://www.google.ca"))).toBe(false);
  });

  test("deny list > matched domains should result in failure", () => {
    const policy = { allowList: false, URLs: ["//google.com"] };
    expect(shouldAllowLink(policy, u("https://google.com"))).toBe(false);
    expect(shouldAllowLink(policy, u("http://www.google.com"))).toBe(true);
    expect(shouldAllowLink(policy, u("http://www.google.ca"))).toBe(true);
  });

  test("deny list > glob matched domains should result in failure", () => {
    const policy = { allowList: false, URLs: ["//*google.com"] };
    expect(shouldAllowLink(policy, u("https://google.com"))).toBe(false);
    expect(shouldAllowLink(policy, u("http://www.google.com"))).toBe(false);
    expect(shouldAllowLink(policy, u("http://www.google.ca"))).toBe(true);
  });
});
