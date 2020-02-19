import React from "/vendor/react";
import Link from "/vendor/@material-ui/core";
import { LinkIcon } from "/lib/component/icon";

const parseLink = value => {
  try {
    new URL(value);
  } catch (e) {
    return value;
  }
  return (
    <Link href={value}>
      {value}
      <LinkIcon className={this.props.classes.icon} />
    </Link>
  );
};

export default parseLink;
