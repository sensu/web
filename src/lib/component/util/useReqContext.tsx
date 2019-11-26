import { parseStringParam } from "/lib/util/params";
import { useRouter } from "/lib/component/util";

const useReqContext = () => {
  const router = useRouter();
  const params = router.match.params as any;
  const simpleUrl = !router.location.pathname.includes("~");

  return {
    namespace: parseStringParam(params.namespace, ""),
    cluster: parseStringParam(params.cluster, (simpleUrl ? "" : "~")),
  };
};

export default useReqContext;
