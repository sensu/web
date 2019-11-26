import { parseStringParam } from "/lib/util/params";
import { useRouter } from "/lib/component/util";

const useReqContext = () => {
  const router = useRouter();
  const params = router.match.params as any;

  return {
    namespace: parseStringParam(params.namespace, ""),
    cluster: parseStringParam(params.cluster, "~"),
  };
};

export default useReqContext;
