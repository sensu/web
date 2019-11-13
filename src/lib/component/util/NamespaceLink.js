import React from "/vendor/react";
import PropTypes from "prop-types";
import useRouter from "./useRouter";
import { Link } from "/vendor/react-router-dom";

const createPath = ({ cluster, namespace, to }) => {
  if (cluster) {
    return `/c/${cluster}/n/${namespace}${to}`;
  }
  return `/n/${namespace}${to}`;
}

const NamespaceLink = (props) => {
    const { component: Component, namespace, cluster, to, ...other } = props;
    const path = createPath({ namespace, cluster, to });
    return <Component {...other} to={path} />;
}

const NamespaceLinkContainer = ({ namespace: namespaceProp, cluster: clusterProp, ...props }) => {
  const router = useRouter();
  const params = router.match.params;
  const context = {
    namespace: namespaceProp ? namespaceProp : params.namespace,
    cluster: clusterProp ? clusterProp : params.cluster,
  };

  return (
    <NamespaceLink {...props} {...context} />
  );
}

NamespaceLinkContainer.propTypes = {
  namespace: PropTypes.string,
  cluster: PropTypes.string,
}

NamespaceLinkContainer.defaultProps = {
  namespace: undefined,
  cluster: undefined,
  component: Link,
};

NamespaceLink.propTypes = {
  ...Link.PropTypes,
  component: PropTypes.func.isRequired,
  to: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  cluster: PropTypes.string,
};

export default NamespaceLinkContainer;
