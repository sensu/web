import merge from "deepmerge";
import { withClientState } from "apollo-link-state";
import auth from "./resolvers/auth";
import lastNamespace from "./resolvers/lastNamespace";
import localNetwork from "./resolvers/localNetwork";
import theme from "./resolvers/theme";
import addDeletedFieldTo from "./resolvers/deleted";

const stateLink = ({ cache, resolvers }) =>
  withClientState({
    ...merge.all([
      {},
      auth,
      lastNamespace,
      localNetwork,
      theme,
      addDeletedFieldTo("CheckConfig"),
      addDeletedFieldTo("Entity"),
      addDeletedFieldTo("Event"),
      addDeletedFieldTo("Silenced"),
      ...resolvers,
    ]),
    cache,
  });

export default stateLink;
