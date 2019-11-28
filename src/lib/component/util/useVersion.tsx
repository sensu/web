import gql from "/vendor/graphql-tag";
import { useQuery } from "./useQuery";

const query = gql`
  query SensuVersion {
    versions {
      backend {
        version
      }
    }
  }
`;

const useVersion = (): [string | null, boolean] => {
  const { data, networkStatus } = useQuery({
    query,
    fetchPolicy: "cache-first",
  });

  const loading = networkStatus < 6;
  if (loading || !data || !data.versions) {
    return [null, loading];
  }

  return [data.versions.backend.version as string, loading];
};

export default useVersion;
