import React, { useCallback, useMemo } from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { useApolloClient, useQuery, useRouter } from "/lib/component/util";
import { Dialog, Fade } from "/vendor/@material-ui/core";
import ContextSwitcher from "/lib/component/partial/ContextSwitcher";
import { PollingDuration } from "/lib/constant";

const openQuery = gql`
  query SwitcherIsOpenQuery {
    modalStack @client
  }
`;

const closeQuery = gql`
  mutation CloseSwitcher {
    clearModal(modal: CONTEXT_SWITCHER_MODAL) @client
  }
`;

const namespacesQuery = gql`
  query NamespacesQuery {
    viewer {
      namespaces {
        name
      }
    }
  }
`;

interface Namespace {
  name: string;
  cluster: string;
}

const FadeIn = (props: object) => <Fade in {...props} />;

const Switcher = () => {
  const client = useApolloClient();
  const router = useRouter();
  const { data, loading } = useQuery({
    query: namespacesQuery,
    pollInterval: PollingDuration.infrequent,
    fetchPolicy: "cache-and-network",
  });

  const namespaces = useMemo(() => {
    if (data && data.viewer) {
      const namespaces = data.viewer.namespaces as Namespace[];
      return namespaces.map((ns) => ({
        ...ns,
        cluster: "local-cluster",
      }));
    }
    return [];
  }, [data]);

  const onClose = useCallback(() => {
    client.mutate({ mutation: closeQuery });
  }, [client]);

  const onSelect = useCallback(
    (namespace) => {
      router.history.push(`/${namespace.name}`);
      client.mutate({ mutation: closeQuery });
    },
    [client, router],
  );

  return (
    <ContextSwitcher
      namespaces={namespaces}
      loading={loading}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
};

const ContextSwitcherDialog = () => {
  const queryResult = useQuery({ query: openQuery });
  const open = queryResult.data.modalStack.includes("CONTEXT_SWITCHER_MODAL");
  const fullScreen = false;

  return (
    <Dialog
      open={open}
      TransitionComponent={FadeIn}
      fullScreen={fullScreen}
      fullWidth={fullScreen}
      PaperProps={{
        style: !fullScreen
          ? {
              minHeight: 400,
              maxHeight: 448,
              width: 320,
            }
          : {},
      }}
    >
      <Switcher />
    </Dialog>
  );
};

export default ContextSwitcherDialog;
