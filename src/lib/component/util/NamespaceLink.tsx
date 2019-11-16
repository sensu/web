import * as React from "/vendor/react";
import useRouter from "./useRouter";
import { Link, LinkProps } from "/vendor/react-router-dom";

interface CreatePathProps {
  cluster?: string;
  namespace: string;
  to: any;
}

interface CommonProps extends LinkProps {
  cluster?: string;
}

interface Props extends CommonProps {
  component: React.ComponentType<any>;
  namespace: string;
}

interface ContainerProps extends CommonProps {
  component?: React.ComponentType<any>;
  namespace?: string;
}

const createPath = ({ cluster, namespace, to }: CreatePathProps) => {
  if (cluster) {
    return `/c/${cluster}/n/${namespace}${to}`;
  }
  return `/n/${namespace}${to}`;
};

const NamespaceLink = (props: Props) => {
  const { component: Component, namespace, cluster, to, ...other } = props;
  const path = createPath({ namespace, cluster, to });
  return <Component {...other} to={path} />;
};

const NamespaceLinkContainer = ({
  component = Link,
  cluster: clusterProp,
  namespace: namespaceProp,
  ...props
}: ContainerProps) => {
  const router = useRouter();
  const params = router.match.params as any;
  const context = {
    namespace: namespaceProp ? namespaceProp : params.namespace,
    cluster: clusterProp ? clusterProp : params.cluster,
  };

  return <NamespaceLink component={component} {...props} {...context} />;
};

export default NamespaceLinkContainer;
