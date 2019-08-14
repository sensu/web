import React, { useMemo } from "/vendor/react";
import gql from "/vendor/graphql-tag";
import Label from "./NamespaceLabelBase";
import { findIcon } from "/lib/util/namespaceIcon";

interface Props {
  namespace?: {
    name: string;
  };
}

const NamespaceLabel = (props: Props) => {
  const { namespace, ...other } = props;
  const name = namespace ? namespace.name : "";
  const icon = useMemo(() => findIcon(name), [name]);

  return <Label name={name} icon={icon} {...other} />;
};

NamespaceLabel.fragments = {
  namespace: gql`
    fragment NamespaceLabel_namespace on Namespace {
      name
    }
  `,
};

export default NamespaceLabel;
