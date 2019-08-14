import React, { useMemo } from "/vendor/react";
import gql from "graphql-tag";
import Icon from "./Icon";
import { findIcon } from "/lib/util/namespaceIcon";

interface Props {
  namespace?: {
    name: string;
  };
}

const NamespaceIcon = (props: Props) => {
  const { namespace, ...other } = props;
  const name = namespace ? namespace.name : "";
  const icon = useMemo(() => findIcon(name), [name]);

  return <Icon icon={icon} {...other} />;
};

NamespaceIcon.fragments = {
  namespace: gql`
    fragment NamespaceIcon_namespace on Namespace {
      name
    }
  `,
};

export default NamespaceIcon;
