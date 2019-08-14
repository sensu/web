import React from "/vendor/react";
import classnames from "/vendor/classnames";
import { makeStyles, createStyles } from "/vendor/@material-ui/styles";
import { Theme } from "/vendor/@material-ui/core/styles/createMuiTheme";

import {
  DonutSmallIcon,
  ExploreIcon,
  VisibilityIcon,
  EmoticonIcon,
  HotIcon,
  DonutIcon,
  BriefcaseIcon,
  HeartIcon,
  HalfHeartIcon,
  HeartMugIcon,
  EspressoIcon,
  PolyIcon,
} from "/lib/component/icon";

export const icons = {
  BRIEFCASE: BriefcaseIcon,
  DONUTSM: DonutSmallIcon,
  DONUT: DonutIcon,
  EMOTICON: EmoticonIcon,
  EXPLORE: ExploreIcon,
  FIRE: HotIcon,
  HEART: HeartIcon,
  HALFHEART: HalfHeartIcon,
  MUG: HeartMugIcon,
  ESPRESSO: EspressoIcon,
  POLYGON: PolyIcon,
  VISIBILITY: VisibilityIcon,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "inline-flex",
      position: "relative",
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.dark,
    },
    child: {
      position: "absolute",
      display: "inline-flex",
      alignSelf: "flex-end",
      bottom: 0,
      right: 0,
    },
  }),
);

interface Props {
  children?: React.ReactElement;
  className?: string;
  icon: string;
  size?: number;
}

const Icon = (props: Props) => {
  const {
    children = null,
    className: classNameProp,
    icon,
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
    borderRadius: "100%",
  };

  return (
    <div className={className} style={containerStyles}>
      <DisplayIcon style={iconStyles} />
      {children && React.cloneElement(children, { className: classes.child })}
    </div>
  );
};

export default Icon;
