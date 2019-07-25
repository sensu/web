import { calcSplay, nextInterval } from "./check";

test("nextInterval", () => {
  const splay = calcSplay("my-check");
  const date = new Date(0);

  expect(nextInterval(1, splay, date)).toEqual(new Date(468));
  expect(nextInterval(10, splay, date)).toEqual(new Date(9712));
  expect(nextInterval(60, splay, date)).toEqual(new Date(19712));
});
