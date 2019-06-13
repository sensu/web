import * as React from "react";

import { SetQueryParams, QueryParamsMap } from "./QueryParams";

type Intersection<A, B> = {
  [K in keyof A]: K extends keyof B ? (A[K] extends B[K] ? A[K] : B[K]) : (A[K])
};

interface Options {
  keys: string[];
  defaults?: QueryParamsMap;
}

interface QueryParamsProps {
  queryParams: QueryParamsMap;
  setQueryParams: SetQueryParams;
}

declare function withQueryParams(
  options: Options,
): <P extends Intersection<P, QueryParamsProps>>(
  Component: React.ComponentType<P>,
) => React.ComponentType<
  Omit<P, keyof QueryParamsProps> & {
    wrappedComponentRef?: React.Ref<React.ComponentType<P>>;
  }
>;

export default withQueryParams;
