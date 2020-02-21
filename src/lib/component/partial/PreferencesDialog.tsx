import React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { Dialog, Fade } from "/vendor/@material-ui/core";
import { useApolloClient, useBreakpoint, useQuery } from "/lib/component/util";

import Preferences from "./Preferences";

const openQuery = gql`
  query SwitcherIsOpenQuery {
    modalStack @client
  }
`;

const closeQuery = gql`
  mutation CloseSwitcher {
    clearModal(modal: PREFERENCES_MODAL) @client
  }
`;

const PreferencesDialog = () => {
  const client = useApolloClient();
  const fullScreen = !useBreakpoint("sm", "gt");

  const queryResult = useQuery({ query: openQuery });
  const open = queryResult.data.modalStack.includes("PREFERENCES_MODAL");
  const onClose = React.useCallback(
    () => client.mutate({ mutation: closeQuery }),
    [client],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      fullScreen={fullScreen}
      fullWidth
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
      <Preferences onClose={onClose} />
    </Dialog>
  );
};

export default PreferencesDialog;
