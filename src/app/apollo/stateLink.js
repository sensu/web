import merge from "deepmerge";
import addDeletedFieldTo from "./resolvers/deleted";
import auth from "./resolvers/auth";
import drawer from "./resolvers/drawer";
import lastNamespace from "./resolvers/lastNamespace";
import localNetwork from "./resolvers/localNetwork";
import modal from "./resolvers/modal";
import theme from "./resolvers/theme";

export default resolvers =>
  merge.all([
    {},
    auth,
    lastNamespace,
    localNetwork,
    theme,
    modal,
    drawer,
    addDeletedFieldTo("CheckConfig"),
    addDeletedFieldTo("Entity"),
    addDeletedFieldTo("Event"),
    addDeletedFieldTo("EventFilter"),
    addDeletedFieldTo("Handler"),
    addDeletedFieldTo("Mutator"),
    addDeletedFieldTo("Silenced"),
    ...resolvers,
  ]);
