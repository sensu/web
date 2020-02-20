import React from "/vendor/react";
import {
  Box,
  ListItem,
  ListItemProps,
  Tooltip,
  Typography,
} from "/vendor/@material-ui/core";
import { animated, useSpring } from "/vendor/react-spring";
import { KeyboardArrowDownIcon } from "/lib/component/icon";

import IconContainer from "./IconContainer";
import { Link as LinkType } from "./types";
import { heights } from "./constants";

interface LinkProps {
  adornment?: React.ReactElement;
  collapsed?: boolean;
  contents: React.ReactElement;
  disabled?: boolean;
  hint?: React.ReactElement;
  href?: string;
  icon?: React.ReactElement;
  onClick?: () => void;
}

function ListItemLink(props: ListItemProps<"a", { button?: true }>) {
  return <ListItem button component="a" {...props} />;
}

const Link = ({
  adornment,
  collapsed = false,
  contents,
  disabled = false,
  hint,
  href,
  icon,
  onClick,
}: LinkProps) => {
  const link = (
    <Box display="flex" justifyContent="left" height={heights.menuitem}>
      <ListItemLink
        disabled={disabled || (!href && !onClick)}
        disableGutters
        dense
        href={href}
        onClick={onClick}
      >
        <IconContainer icon={icon} />
        <Box
          clone
          display="flex"
          alignItems="center"
          marginLeft={1}
          flexGrow="1"
        >
          <Typography variant="body1" color="inherit" noWrap>
            {contents}
          </Typography>
        </Box>
        {adornment && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={48}
            height={48}
          >
            {adornment}
          </Box>
        )}
      </ListItemLink>
    </Box>
  );

  if (collapsed) {
    return (
      <Tooltip title={hint || contents} placement="right">
        {link}
      </Tooltip>
    );
  }

  return link;
};

interface FolderProps {
  contents: React.ReactElement;
  disabled: boolean;
  expanded: boolean;
  hint?: React.ReactElement;
  icon?: React.ReactElement;
  links: LinkType[];
  onExpand: () => void;
}

const Folder = ({
  icon,
  contents,
  links,
  expanded,
  onExpand,
  ...props
}: FolderProps) => {
  const childStyles = useSpring({
    from: {
      height: 0,
      opacity: 0,
    },
    to: {
      height: expanded ? links.length * heights.menuitem : 0,
      opacity: expanded ? 1 : 0,
    },
  });

  const adnormentStyles = useSpring({
    transform: expanded
      ? "rotateX(180deg) translateY(5%)"
      : "rotateX(0deg) translateY(0px)",
  });

  return (
    <React.Fragment>
      <Link
        {...props}
        icon={icon}
        adornment={
          <animated.span style={adnormentStyles}>
            <KeyboardArrowDownIcon />
          </animated.span>
        }
        contents={contents}
        onClick={onExpand}
      />
      <Box component={animated.ul} overflow="hidden" style={childStyles}>
        {links.map(({ id, ...rest }) => (
          <Link key={id} disabled={!expanded} {...rest} />
        ))}
      </Box>
    </React.Fragment>
  );
};

type Props = LinkProps | FolderProps;

const MenuItem = (props: Props) => {
  if ((props as FolderProps).links !== undefined) {
    return <Folder {...props as FolderProps} />;
  }
  return <Link {...props} />;
};

export default MenuItem;
