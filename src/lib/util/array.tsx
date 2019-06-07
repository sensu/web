export const shallowEqual = (as: any[], bs: any[]): boolean => {
  if (as === bs) {
    return true;
  }
  if (as.length !== bs.length) {
    return false;
  }
  for (let i = 0; i < as.length; i += 1) {
    if (as[i] !== bs[i]) {
      return false;
    }
  }
  return true;
};

export const mergeAtIndex = <T extends any>(
  arr: T[],
  index: number,
  update: Partial<T>,
): T[] =>
  arr
    .slice(0, index)
    .concat([
      {
        ...arr[index],
        ...update,
      },
    ])
    .concat(arr.slice(index + 1));

export const removeAtIndex = <T extends any>(arr: T[], index: number): T[] =>
  arr.slice(0, index).concat(arr.slice(index + 1));

export const wrapArray = <T extends any>(arr: T[] | T): T[] =>
  Array.isArray(arr) ? arr : [arr];
