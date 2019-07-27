import { calcSplay, nextInterval } from "./check";

test("nextInterval", () => {
  let splay = calcSplay("my-check");
  let date = new Date(0);

  expect(nextInterval(1, splay, date)).toEqual(new Date(712));
  expect(nextInterval(10, splay, date)).toEqual(new Date(9712));
  expect(nextInterval(60, splay, date)).toEqual(new Date(19712));

  splay = calcSplay("my-check-w-handlers");
  date = new Date(2000000000000);

  expect(nextInterval(1, splay, date)).toEqual(new Date(2000000000849));
  expect(nextInterval(10, splay, date)).toEqual(new Date(2000000000849));
  expect(nextInterval(60, splay, date)).toEqual(new Date(2000000050849));
});
