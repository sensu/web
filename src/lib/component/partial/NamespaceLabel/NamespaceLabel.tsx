import React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import Label from "./NamespaceLabelBase";

interface Props {
  namespace?: {
    name: string;
  };
}

const NamespaceLabel = (props: Props) => {
  const { namespace, ...other } = props;
  const name = namespace ? namespace.name : "";

  return <Label name={name} {...other} />;
};

NamespaceLabel.fragments = {
  namespace: gql`
    fragment NamespaceLabel_namespace on Namespace {
      name
    }
  `,
};

export default NamespaceLabel;
