function compose<R>(
  func: (value: R) => R,
  ...funcs: ((a: R) => R)[]
): (value: R) => R {
  return funcs.reduce(
    (prevFn, nextFn): ((value: R) => R) => (value: R): R =>
      prevFn(nextFn(value)),
    func,
  );
}

export default compose;
