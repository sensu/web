import merge from "deepmerge";
import auth from "./resolvers/auth";
import lastNamespace from "./resolvers/lastNamespace";
import localNetwork from "./resolvers/localNetwork";
import theme from "./resolvers/theme";
import addDeletedFieldTo from "./resolvers/deleted";
import modal from "./resolvers/modal";

export default resolvers =>
  merge.all([
    {},
    auth,
    lastNamespace,
    localNetwork,
    theme,
    modal,
    addDeletedFieldTo("CheckConfig"),
    addDeletedFieldTo("Entity"),
    addDeletedFieldTo("Event"),
    addDeletedFieldTo("EventFilter"),
    addDeletedFieldTo("Handler"),
    addDeletedFieldTo("Mutator"),
    addDeletedFieldTo("Silenced"),
    ...resolvers,
  ]);
