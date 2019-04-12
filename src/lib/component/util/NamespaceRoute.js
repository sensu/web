import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { Route } from "/vendor/react-router-dom";

import { FailedError } from "/lib/error/FetchError";

import Query from "/lib/component/util/Query";
import LastNamespaceUpdater from "/lib/component/util/LastNamespaceUpdater";

const renderRouteHandler = (render, Component, routeProps) => {
  if (typeof render === "function") {
    return render(routeProps);
  }

  if (Component) {
    return <Component {...routeProps} />;
  }

  return null;
};

class NamespaceRoute extends React.PureComponent {
  static propTypes = {
    ...Route.propTypes,
    component: PropTypes.func,
    children: PropTypes.func,
    render: PropTypes.func,
    fallbackRender: PropTypes.func,
    fallbackComponent: PropTypes.func,
    loadingRender: PropTypes.func,
    loadingComponent: PropTypes.func,
  };

  static defaultProps = {
    children: undefined,
    component: undefined,
    render: undefined,
    fallbackRender: undefined,
    fallbackComponent: undefined,
    loadingRender: undefined,
    loadingComponent: undefined,
  };

  static query = gql`
    query NamespaceRouteQuery($namespace: String!) {
      namespace(name: $namespace) {
        name
      }
    }
  `;

  render() {
    const {
      component,
      children,
      render,
      fallbackRender,
      fallbackComponent,
      loadingRender,
      loadingComponent,
      ...props
    } = this.props;

    return (
      <Route {...props}>
        {routeProps => {
          if (routeProps.match.params.namespace === undefined) {
            throw new Error("NamespaceRoute path must include ':namespace'");
          }

          return (
            <Query
              query={NamespaceRoute.query}
              variables={{
                namespace: routeProps.match.params.namespace,
              }}
              onError={error => {
                if (error.networkError instanceof FailedError) {
                  return;
                }

                throw error;
              }}
            >
              {({ data: { namespace = null } = {}, networkStatus }) => {
                // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
                const loading = networkStatus < 6;

                if (namespace === null) {
                  if (loading && (loadingRender || loadingComponent)) {
                    return renderRouteHandler(
                      loadingRender,
                      loadingComponent,
                      routeProps,
                    );
                  }

                  if (!loading && (fallbackRender, fallbackComponent)) {
                    return renderRouteHandler(
                      fallbackRender,
                      fallbackComponent,
                      routeProps,
                    );
                  }
                }

                return (
                  <React.Fragment>
                    {namespace !== null && (
                      <LastNamespaceUpdater namespace={namespace.name} />
                    )}
                    {renderRouteHandler(
                      children || render,
                      component,
                      routeProps,
                    )}
                  </React.Fragment>
                );
              }}
            </Query>
          );
        }}
      </Route>
    );
  }
}

export default NamespaceRoute;
