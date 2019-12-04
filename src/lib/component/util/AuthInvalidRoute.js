import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import ConditionalRoute from "./ConditionalRoute";
import useQuery from "./useQuery";

const AuthInvalidRouteQuery = gql`
  query AuthInvalidRouteQuery {
    auth @client {
      invalid
    }
  }
`;

const AuthInvalidRoute = props => {
  const { data = {} } = useQuery({
    query: AuthInvalidRouteQuery,
    onError: err => {
      throw err;
    },
  });

  return <ConditionalRoute {...props} active={data.auth.invalid} />;
};

export default AuthInvalidRoute;
