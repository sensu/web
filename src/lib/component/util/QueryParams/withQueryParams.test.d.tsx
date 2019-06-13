import * as React from "react";

import withQueryParams from "./withQueryParams";
import { SetQueryParams, QueryParamsMap } from "./QueryParams";

declare class A extends React.Component<{
  foo: string;
  queryParams: QueryParamsMap;
  setQueryParams: SetQueryParams;
}> {}

declare class B extends React.Component<{
  foo: string;
}> {}

declare class C extends React.Component<{
  queryParams: number;
}> {}

const WrappedA = withQueryParams({ keys: [] })(A);
const WrappedB = withQueryParams({ keys: [] })(B);

// @ts-ignore number is not compatible with QueryParamsMap
withQueryParams({ keys: [] })(C);

<WrappedA foo="foo" />;
// @ts-ignore number is not compatible with string
<WrappedA foo={3} />;
<WrappedB foo="foo" />;
// @ts-ignore missing prop foo
<WrappedB />;
