import {
  buildFilter,
  buildFilterParams,
  parseFilter,
  parseFilterParams,
  toggleParam,
} from "./filterParams";

describe("filter param utils", () => {
  test("parseFilter", () => {
    expect(parseFilter("")).toEqual(["", ""]);
    expect(parseFilter("foobar")).toEqual(["foobar", ""]);
    expect(parseFilter("foo:bar")).toEqual(["foo", "bar"]);
    expect(parseFilter("foo:bar:baz")).toEqual(["foo", "bar:baz"]);
  });
  test("parseFilterParams", () => {
    expect(parseFilterParams("foo:bar")).toEqual({ foo: "bar" });
    expect(parseFilterParams(["foo:bar"])).toEqual({ foo: "bar" });
    expect(parseFilterParams(["foo:bar", "bar:baz"])).toEqual({
      foo: "bar",
      bar: "baz",
    });
  });
  test("buildFilter", () => {
    expect(buildFilter("foo", "bar")).toEqual("foo:bar");
    expect(buildFilter("foo", "bar:baz")).toEqual("foo:bar:baz");
  });
  test("buildFilterParams", () => {
    expect(buildFilterParams({ foo: "bar" })).toEqual(["foo:bar"]);
    expect(buildFilterParams({ foo: "bar:baz" })).toEqual(["foo:bar:baz"]);
  });
  test("toggleParam", () => {
    let x;
    toggleParam("foo", fn => {
      x = fn({ bar: "baz" });
    })("bar");
    expect(x).toEqual({ foo: "bar", bar: "baz" });
  });
});
