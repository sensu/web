import React, { useState, useMemo } from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { FailedError } from "/lib/error/FetchError";
import { fetchNamespaces } from "/lib/util/namespaceAPI";
import useQuery from "./useQuery";
import NamespacesProvider from "./NamespacesProvider";

const query = gql`
  query AuthQuery {
    auth @client {
      accessToken
    }
  }
`;

const SyncNamespaces = ({ children }) => {
  const namespaceQuery = useQuery({
    query: query,
    onError: err => {
      if (err.networkError instanceof FailedError) {
        return;
      }

      throw err;
    },
  });

  const [namespaces, setNamespaces] = useState([]);
  // using memo because we only want to run this once
  // otherwise it will cause an infinite loop
  useMemo(() => {
    fetchNamespaces(namespaceQuery.data.auth)
      .then(data => setNamespaces(data))
      .catch(err =>
        // eslint-disable-next-line no-console
        console.error("Unable to fetch namespaces from the API", err),
      );
    // eslint-disable-next-line
  }, []);
  return (
    <NamespacesProvider namespaces={namespaces}>{children}</NamespacesProvider>
  );
};

SyncNamespaces.propTypes = { children: PropTypes.node };

export default SyncNamespaces;
