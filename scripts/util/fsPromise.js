import fs from "fs";

const callback = (resolve, reject) => (error, ...args) => {
  if (error) {
    reject(error);
  } else {
    resolve(args);
  }
};

export default Object.keys(fs).reduce((result, key) => {
  // eslint-disable-next-line no-param-reassign
  result[key] = (...args) =>
    new Promise((resolve, reject) => {
      fs[key](...args, callback(resolve, reject));
    });
  return result;
}, {});
