import React, { useMemo } from "/vendor/react";
import gql from "graphql-tag";
import { Md5 } from "ts-md5";

import { Icon, Colour } from "./types";
import PureIcon from "./Icon";

interface Props {
  namespace?: {
    name: string;
  };
}

const IconValues = Object.values(Icon);
const ColourValues = Object.values(Colour);

const hashStr = (str: string) => {
  const md5 = new Md5();
  const result = md5
    .start()
    .appendStr(str)
    .end(true);

  return result as Int32Array;
};

const NamespaceIcon = (props: Props) => {
  const { namespace, ...other } = props;
  const name = namespace ? namespace.name : "";
  const hash = useMemo(() => hashStr(name), [name]);

  return (
    <PureIcon
      icon={IconValues[Math.abs(hash[0]) % IconValues.length]}
      colour={ColourValues[Math.abs(hash[1]) % ColourValues.length]}
      {...other}
    />
  );
};

NamespaceIcon.fragments = {
  namespace: gql`
    fragment NamespaceIcon_namespace on Namespace {
      name
    }
  `,
};

export default NamespaceIcon;
