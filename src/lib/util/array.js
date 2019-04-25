export const shallowEqual = (as, bs) => {
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

export const mergeAtIndex = (arr, index, update) =>
  arr
    .slice(0, index)
    .concat([
      {
        ...arr[index],
        ...update,
      },
    ])
    .concat(arr.slice(index + 1));

export const removeAtIndex = (arr, index) =>
  arr.slice(0, index).concat(arr.slice(index + 1));
