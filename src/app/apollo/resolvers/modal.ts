import { ApolloCache } from "apollo-cache";
import gql from "graphql-tag";

interface Context {
  cache: ApolloCache<unknown>;
}

interface Args {
  modal: string;
}

interface QueryResp {
  modalStack: string[];
}

const query = gql`
  query GetModalStack {
    modalStack
  }
`;

export default {
  defaults: {
    modalStack: [],
  },
  resolvers: {
    Mutation: {
      toggleModal: (_: unknown, { modal }: Args, { cache }: Context) => {
        const previous = cache.readQuery({ query }) as QueryResp;
        let newStack = [modal];

        const i = previous.modalStack.indexOf(modal);
        if (i >= 0) {
          newStack = previous.modalStack.slice(0, i);
        }

        cache.writeQuery({ query, data: { modalStack: newStack } });
        return true;
      },
      presentModal: (_: unknown, { modal }: Args, { cache }: Context) => {
        const previous = cache.readQuery({ query }) as QueryResp;
        const newStack = [...previous.modalStack, modal];

        cache.writeQuery({ query, data: { modalStack: newStack } });
        return true;
      },
      clearModal: (_: unknown, { modal }: Args, { cache }: Context) => {
        const previous = cache.readQuery({ query }) as QueryResp;
        let newStack = previous.modalStack;

        const i = previous.modalStack.indexOf(modal);
        if (i >= 0) {
          newStack = previous.modalStack.slice(0, i);
        }

        cache.writeQuery({ query, data: { modalStack: newStack } });
        return true
      },
    },
  },
};
