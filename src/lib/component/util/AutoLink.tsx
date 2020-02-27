import React from "/vendor/react";
import { Link } from "/vendor/@material-ui/core";
import { LinkIcon } from "/lib/component/icon";

interface Props {
  value: string;
}

const AutoLink = ({ value }: Props) => {
  try {
    new URL(value);
  } catch (e) {
    return value;
  }
  return (
    <Link href={value}>
      {value}
      <span style={{ verticalAlign: "text-top" }}>
        {" "}
        <LinkIcon fontSize="inherit" />
      </span>
    </Link>
  );
};

export default AutoLink;
