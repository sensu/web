import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { FailedError } from "/lib/error/FetchError";

import { useQuery, useBreakpoint } from "/lib/component/util";
import { AppLayout as BaseAppLayout, Loader } from "/lib/component/base";

import Drawer from "/lib/component/partial/Drawer";
import AppBar from "/lib/component/partial/AppBar";

const query = gql`
  query AppLayoutQuery($namespace: String!) {
    namespace(name: $namespace) {
      id
      ...AppBar_namespace
    }
  }

  ${AppBar.fragments.namespace}
`;

const AppLayout = ({ namespace, fullWidth, children }) => {
  const isSmViewport = useBreakpoint("xs", "lt");
  const isLgViewport = useBreakpoint("md", "gt");

  const { data = {}, loading, aborted } = useQuery({
    query,
    variables: { namespace },
    onError: error => {
      if (error.networkError instanceof FailedError) {
        return;
      }

      throw error;
    },
  });

  return (
    <Loader loading={loading}>
      <BaseAppLayout
        fullWidth={fullWidth}
        mobile={isSmViewport}
        topBar={
          isSmViewport && (
            <AppBar loading={loading || aborted} namespace={data.namespace} />
          )
        }
        drawer={
          !isSmViewport && (
            <Drawer
              variant={isLgViewport ? "large" : "small"}
              loading={loading}
              namespace={data.namespace}
            />
          )
        }
        content={children}
      />
    </Loader>
  );
};

AppLayout.propTypes = {
  namespace: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  children: PropTypes.node,
};

AppLayout.defaultProps = {
  fullWidth: false,
  children: undefined,
};

export default AppLayout;
