import React from "/vendor/react";
import {
  useTheme,
  Box,
  IconButton,
  ListItem,
  Typography,
} from "/vendor/@material-ui/core";
import { animated, useSpring } from "/vendor/react-spring";
import { fade } from "/vendor/@material-ui/core/styles/colorManipulator";
import { FaceIcon, MenuIcon, PreferencesIcon } from "/lib/component/icon";
import { SensuWordmark } from "/lib/component/base";

interface Props {
  userAvatar: React.ReactElement;
  userId: string | React.ReactElement;
  title: React.ReactElement;
  variant: "full" | "collapsed";
  links: {
    id: string;
    icon: React.ReactElement;
    contents: React.ReactElement;
    adornment?: React.ReactElement;
    onClick?: () => void;
    href?: string;
  }[];
  onToggle: () => void;
}

const HorizontalRule = () => {
  const theme = useTheme();
  const color = fade(theme.palette.text.primary, 0.5);

  return (
    <Box
      component="hr"
      border="0"
      margin="0"
      marginTop="-1px"
      height="1px"
      style={{
        background: `linear-gradient(
          to right,
          rgba(0, 0, 0, 0),
          ${color} 2rem,
          ${color},
          ${color} calc(100% - 2rem),
          rgba(0, 0, 0, 0)
        )`,
      }}
    />
  );
};

const IconContainer = ({ icon }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      width={48}
      height={48}
    >
      {icon}
    </Box>
  );
};

const Link = ({ icon, contents, adornment }) => {
  return (
    <Box clone display="flex" justifyContent="left" height={48}>
      <ListItem button disableGutters dense>
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
      </ListItem>
    </Box>
  );
};

// TODO: Move into the theme?
const silver = "rgb(213, 214, 221)";

const Drawer = ({
  title,
  links,
  userId,
  userAvatar,
  variant,
  onToggle,
}: Props) => {
  const theme = useTheme();
  const styles = useSpring({
    width: variant === "full" ? 224 : 64,
    color: variant === "full" ? theme.palette.text.primary : silver,
    backgroundColor: variant === "full" ? "rgba(0,0,0,0)" : "#2D3555",
  });

  return (
    <Box
      component={animated.div}
      height="100vh"
      style={styles}
      flexDirection="column"
      padding={1}
      display="flex"
      overflow="hidden"
    >
      <Box display="flex" alignItems="center" height={56}>
        <IconButton color="inherit" onClick={onToggle}>
          <MenuIcon />
        </IconButton>{" "}
        <Box component="span" marginLeft={1}>
          {title || <SensuWordmark fontSize="inherit" />}
        </Box>
      </Box>
      <HorizontalRule />
      <Box
        component="ul"
        display="flex"
        flexGrow={1}
        flexDirection="column"
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        {links.map(({ id, ...rest }) => (
          <Link key={id} {...rest} />
        ))}
      </Box>
      <HorizontalRule />
      <Box
        display="flex"
        alignItems="center"
        flexDirection={variant === "full" ? "row" : "column"}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          flexGrow="1"
          width={variant === "full" ? undefined : 48}
        >
          <IconContainer
            icon={<Box style={{ color: "#BAED91" }}>{userAvatar}</Box>}
          />
          <Box flexGrow="1" marginLeft={1}>
            <Typography variant="body1" color="inherit" noWrap>
              {userId}
            </Typography>
          </Box>
        </Box>
        <IconButton color="inherit">
          <PreferencesIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Drawer;
