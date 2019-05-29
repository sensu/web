function compose<R>(func: (a: R) => R, ...funcs: ((a: R) => R)[]): (a: R) => R {
  return funcs.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), func);
}

export default compose;
