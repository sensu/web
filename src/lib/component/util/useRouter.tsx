import { useContext } from "/vendor/react";
import { __RouterContext, RouteComponentProps } from "/vendor/react-router-dom";

export default function useRouter(): RouteComponentProps {
  return useContext(__RouterContext);
}
