import React from "/vendor/react";
import { animated, useSpring } from "/vendor/react-spring";
import { KeyboardArrowDownIcon } from "/lib/component/icon";
import {
  Link as RouterLink,
  useLocation,
  matchPath,
} from "/vendor/react-router-dom";
import {
  Box,
  ListItem,
  Theme,
  Tooltip,
  Typography,
  createStyles,
  makeStyles,
} from "/vendor/@material-ui/core";

import IconContainer from "./IconContainer";
import { LinkConfig } from "./types";
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

interface ListItemButtonProps {
  active: boolean;
  children: (React.ReactElement | undefined)[];
  disabled: boolean;
  to?: string;
  onClick?: () => void;
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      active: {
        backgroundColor: theme.palette.action.hover,
        fontWeight: 500,
      },
    }),
  { name: "ListItemButton" },
);

const useIsActive = (href: string) => {
  const location = useLocation();
  const matches = matchPath(location.pathname, {
    path: href,
    exact: false,
    strict: false,
  });
  return !!matches;
};

const ListItemButton = ({
  active,
  children,
  disabled,
  to,
  onClick,
}: ListItemButtonProps) => {
  const classes = useStyles();

  return (
    // @ts-ignore
    <ListItem
      className={active ? classes.active : ""}
      button
      component={to ? RouterLink : "button"}
      disabled={disabled}
      disableGutters
      dense
      to={to}
      onClick={onClick}
    >
      {children}
    </ListItem>
  );
};

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
  const active = useIsActive(href || "");
  const link = (
    <Box display="flex" justifyContent="left" height={heights.menuitem}>
      <ListItemButton
        active={active}
        disabled={disabled || (!href && !onClick)}
        to={href}
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
            <Box component="span" fontWeight={active ? 500 : "inherit"}>
              {contents}
            </Box>
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
      </ListItemButton>
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
  collapsed?: boolean;
  contents: React.ReactElement;
  disabled: boolean;
  expanded: boolean;
  hint?: React.ReactElement;
  icon?: React.ReactElement;
  links: LinkConfig[];
  onExpand: () => void;
}

const Folder = ({
  icon,
  collapsed,
  contents,
  links,
  expanded: expandedProp,
  onExpand,
  ...props
}: FolderProps) => {
  const { pathname } = useLocation();
  const activeLink = React.useMemo(
    () => links.find((link) => matchPath(pathname, { path: link.href })),
    [links, pathname],
  );

  const expanded = (!collapsed && activeLink !== undefined) || expandedProp;
  const childStyles = useSpring({
    height: expanded ? links.length * heights.menuitem : 0,
    opacity: expanded ? 1 : 0,
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
          <Link
            key={id}
            disabled={!expanded}
            {...rest}
            collapsed={collapsed}
            icon={undefined}
          />
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
