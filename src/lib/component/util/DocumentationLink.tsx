import React from "/vendor/react";
import useVersion from "./useVersion";
import { Link as BaseLink } from "/vendor/@material-ui/core";
import makeDocsLink from "/lib/util/makeDocsLink";

const versionFallback = "latest";

interface CommonProps {
  Component?: any;
  children: React.ReactElement | string;
  path: string;
}

interface PureProps extends CommonProps {
  version: string;
}

interface Props extends CommonProps {
  version?: string;
}

const Link = ({ Component, version, path, ...props }: PureProps) => {
  const link = makeDocsLink({ version, path });

  return (
    <Component
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      {...props}
    />
  );
};

Link.displayName = "DocumentationLink.Pure";
Link.defaultProps = {
  Component: BaseLink,
  version: "latest",
};

const Connected = (props: CommonProps) => {
  const [version] = useVersion();
  return <Link {...props} version={version || versionFallback} />;
};

Connected.displayName = "DocumentationLink.Connected";

const DocumentationLink = ({ version, ...props }: Props) => {
  if (version === undefined) {
    return <Connected {...props} />;
  }
  return <Link {...props} version={version} />;
};

export default React.memo(DocumentationLink);
