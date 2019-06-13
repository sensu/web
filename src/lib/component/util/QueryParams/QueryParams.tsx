import React from "/vendor/react";
import { withRouter, RouteComponentProps } from "/vendor/react-router-dom";

export interface QueryParamsMap {
  [name: string]: string | string[] | undefined;
}

export type QueryParamsUpdater =
  | ((params: URLSearchParams) => void)
  | QueryParamsMap;

export interface SetQueryParams {
  (update: QueryParamsUpdater): void;
}

function setter(
  qry: URLSearchParams,
  key: string,
  val: string | string[] | undefined,
): void {
  if (Array.isArray(val)) {
    qry.delete(key);
    val.forEach((v: string): void => qry.append(key, v));
  } else if (val !== undefined) {
    qry.set(key, val);
  }
}

function expandParams(
  params: URLSearchParams,
  keys: string[],
  defaults: QueryParamsMap,
): QueryParamsMap {
  const matched = Array.from(params).reduce(
    (acc: QueryParamsMap, entry): QueryParamsMap => {
      const [key, val] = entry;
      if (keys && keys.indexOf(key) === -1) {
        return acc;
      }

      const prevVal = acc[key];
      if (Array.isArray(prevVal)) {
        acc[key] = [val, ...prevVal];
      } else if (prevVal) {
        acc[key] = [val, prevVal];
      } else {
        acc[key] = val;
      }

      return acc;
    },
    {},
  );

  return keys.reduce((acc: QueryParamsMap, key): QueryParamsMap => {
    if (!acc[key]) {
      acc[key] = defaults[key];
    }
    return acc;
  }, matched);
}
// withRouter() injects RouteComponentProps into wrapped component
interface Props extends RouteComponentProps {
  children(
    params: QueryParamsMap,
    setQueryParams: SetQueryParams,
  ): JSX.Element | null;
  defaults: QueryParamsMap;
  keys: string[];
}
interface State {
  params: URLSearchParams;
}
class QueryParams extends React.Component<Props, State> {
  static defaultProps = {
    keys: [],
    defaults: {},
  };

  static getDerivedStateFromProps(nextProps: Props): State {
    return {
      params: new URLSearchParams(nextProps.location.search),
    };
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.children !== nextProps.children) {
      return true;
    }
    if (this.props.location.pathname !== nextProps.location.pathname) {
      return true;
    }
    if (this.props.location.search !== nextProps.location.search) {
      return true;
    }
    return false;
  }

  setQueryParams = (update: QueryParamsUpdater) => {
    const { params } = this.state;

    if (typeof update === "function") {
      update(params);
    } else {
      Object.keys(update).forEach(
        (key: string): void => setter(params, key, update[key]),
      );
    }

    const newPath = `${this.props.location.pathname}?${params.toString()}`;
    this.props.history.push(newPath);
  };

  render() {
    const params = expandParams(
      this.state.params,
      this.props.keys,
      this.props.defaults,
    );

    return this.props.children(params, this.setQueryParams);
  }
}

export default withRouter(QueryParams);
