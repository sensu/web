import React, { useCallback, useMemo } from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { Dialog, Fade } from "/vendor/@material-ui/core";
import ContextSwitcher from "/lib/component/partial/ContextSwitcher";
import { PollingDuration } from "/lib/constant";
import {
  useApolloClient,
  useBreakpoint,
  useQuery,
  useRouter,
} from "/lib/component/util";

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

const Switcher = React.forwardRef((_, ref) => {
  const client = useApolloClient();
  const router = useRouter();

  const { data, networkStatus } = useQuery({
    query: namespacesQuery,
    pollInterval: PollingDuration.infrequent,
    fetchPolicy: "cache-and-network",
  });

  const loading = networkStatus < 6;
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
      ref={ref}
      namespaces={namespaces}
      loading={loading}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
});

const ContextSwitcherDialog = () => {
  const queryResult = useQuery({ query: openQuery });
  const open = queryResult.data.modalStack.includes("CONTEXT_SWITCHER_MODAL");
  const fullScreen = !useBreakpoint("sm", "gt");

  return (
    <Dialog
      open={open}
      TransitionComponent={Fade}
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
