// @flow

// $ExpectErrorm Cast compose func through any to flow's built in $Compose type
const compose: any = (...funcs) =>
  funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

export default (compose: $Compose);
