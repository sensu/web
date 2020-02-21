import React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import useClient from "./useApolloClient";
import useQuery from "./useQuery";

const query = gql`
  query QueryDrawerPref {
    preferMinDrawer @client
  }
`;

interface QueryResp {
  preferMinDrawer: boolean;
}

const mutation = gql`
  mutation SetDrawerPref($min: Boolean!) {
    setDrawerPreference(minified: $min) @client
  }
`;

const useDrawerPreference = () => {
  const client = useClient();
  const setter = React.useCallback(
    (min) => {
      client.mutate({ mutation, variables: { min } });
    },
    [client],
  );

  const result = useQuery<QueryResp>({ query });
  return [(result.data as QueryResp).preferMinDrawer || false, setter];
};

export default useDrawerPreference;
