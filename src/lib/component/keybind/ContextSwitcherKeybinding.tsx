import React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { useApolloClient, useKeybind } from "/lib/component/util";
import { contextSwitcherKeybinding } from "/lib/constant";

const mutation = gql`
  mutation ToggleSwitcher {
    toggleModal(modal: CONTEXT_SWITCHER_MODAL) @client
  }
`;

const ContextSwitcherKeybinding = () => {
  const client = useApolloClient();
  useKeybind({
    id: "context-switcher-toggle",
    keys: contextSwitcherKeybinding,
    callback: () => {
      client.mutate({ mutation });
    },
  });

  return <React.Fragment />;
};

export default ContextSwitcherKeybinding;
