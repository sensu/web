import React from "/vendor/react";
import classnames from "/vendor/classnames";

import { makeStyles, createStyles } from "/vendor/@material-ui/styles";
import { Theme } from "/vendor/@material-ui/core/styles/createMuiTheme";
import { fade } from "/vendor/@material-ui/core/styles/colorManipulator";

import { Colour, Icon } from "./types";

import {
  DonutSmallIcon,
  ExploreIcon,
  VisibilityIcon,
  EmoticonIcon,
  BriefcaseIcon,
  PolyIcon,
} from "/lib/component/icon";

import {
  CirclesIntersectIcon,
  CrownIcon,
  EspressoIcon,
  FlameIcon,
  GlassesIcon,
  HeartIcon,
  MugIcon,
  ShieldIcon,
  TriangleIcon,
} from "/lib/component/icon/namespace";

interface Props {
  children?: React.ReactElement;
  className?: string;
  icon: Icon;
  colour: Colour;
  size?: number;
}

export const icons = {
  [Icon.BRIEFCASE]: BriefcaseIcon,
  [Icon.CROWN]: CrownIcon,
  [Icon.DONUT]: DonutSmallIcon,
  [Icon.EMOTICON]: EmoticonIcon,
  [Icon.EXPLORE]: ExploreIcon,
  [Icon.FLAME]: FlameIcon,
  [Icon.GLASSES]: GlassesIcon,
  [Icon.HEART]: HeartIcon,
  [Icon.MEETING]: CirclesIntersectIcon,
  [Icon.MUG]: MugIcon,
  [Icon.ESPRESSO]: EspressoIcon,
  [Icon.POLYGON]: PolyIcon,
  [Icon.SHIELD]: ShieldIcon,
  [Icon.TRIANGLE]: TriangleIcon,
  [Icon.VISIBILITY]: VisibilityIcon,
};

export const colours = {
  [Colour.BLUE]: "#8AB8D0",
  [Colour.GRAY]: "#9A9EA5",
  [Colour.GREEN]: "#8AD1AF",
  [Colour.ORANGE]: "#F4AD5F",
  [Colour.PINK]: "#FA8072",
  [Colour.PURPLE]: "#AD8AD1",
  [Colour.YELLOW]: "#FAD66B",
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        display: "inline-flex",
        position: "relative",
        color: fade(theme.palette.common.white, 0.71),
        // or maybe...
        // color: "rgba(48,48,225, 0.71)",
        // color: "rgba(96, 96, 128, 1)",
      },
      child: {
        position: "absolute",
        display: "inline-flex",
        alignSelf: "flex-end",
        bottom: 0,
        right: 0,
      },
    }),
  { name: "NamespaceIcon" },
);

const NamespaceIcon = (props: Props) => {
  const {
    children = null,
    className: classNameProp,
    icon,
    colour,
    size = 24.0,
  } = props;

  // Classes
  const classes = useStyles();
  const className = classnames(classNameProp, classes.root);
  const DisplayIcon = icons[icon];

  // Inline styles
  const iconStyles = {
    margin: `calc(${size}px * (1/12))`,
    height: `calc(${size}px * (5/6))`,
    width: `calc(${size}px * (5/6))`,
  };
  const containerStyles = {
    width: size,
    height: size,
    borderRadius: 4,
    backgroundColor: colours[colour],
  };

  return (
    <div className={className} style={containerStyles}>
      <DisplayIcon style={iconStyles} />
      {children && React.cloneElement(children, { className: classes.child })}
    </div>
  );
};

export default NamespaceIcon;
