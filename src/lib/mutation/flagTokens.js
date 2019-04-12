import gql from "/vendor/graphql-tag";

const mutation = gql`
  mutation FlagTokensMutation {
    flagTokens @client
  }
`;

export default client => client.mutate({ mutation });
