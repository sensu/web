import React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { useApolloClient, useKeybind } from "/lib/component/util";
import { preferencesKeybinding } from "/lib/constant";

const mutation = gql`
  mutation ToggleSwitcher {
    toggleModal(modal: PREFERENCES_MODAL) @client
  }
`;

const PreferencesKeybinding = () => {
  const client = useApolloClient();
  useKeybind({
    id: "preferences-toggle",
    keys: preferencesKeybinding,
    callback: () => {
      client.mutate({ mutation });
    },
  });

  return <React.Fragment />;
};

export default PreferencesKeybinding;
