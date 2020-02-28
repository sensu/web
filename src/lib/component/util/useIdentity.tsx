import gql from "/vendor/graphql-tag";
import useQuery from "./useQuery";

interface AuthDetails {
  accessToken: string;
}

interface QueryResp {
  auth: AuthDetails;
}

interface Identity {
  jti: string;
  sub: string;
  groups: string[];
}

const query = gql`
  query GetIdentity {
    auth @client {
      accessToken
    }
  }
`;

// Retrieves, parses and returns the currently authorized user's identity from
// the store.
const useIdentity = () => {
  const result = useQuery({ query });
  const data = result.data as QueryResp;

  const token = data.auth.accessToken || "";
  const info = token.split(".")[1] || "";
  const identity = JSON.parse(window.atob(info) || "{}") as Identity;

  return identity;
};

export default useIdentity;
