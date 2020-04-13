import React from "/vendor/react";
import {
  createStyles,
  makeStyles,
  Typography,
  Theme,
} from "/vendor/@material-ui/core";
import {
  darken,
  emphasize,
} from "/vendor/@material-ui/core/styles/colorManipulator";
import classNames from "/vendor/classnames";
import { AutoLink, useConfigurationProvider } from "/lib/component/util";
import newURL from "/lib/util/url";
import shouldAllowLink from "/lib/util/linkPolicy";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: emphasize(theme.palette.text.primary, 0.22),
      display: "inline",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    base: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      display: "inline-block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      height: "22px",
    },
    key: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      background: theme.palette.primary.main,
      borderRadius: `${theme.spacing(0.5)}px 0 0 ${theme.spacing(0.5)}px`,
      border: `1px solid ${theme.palette.primary.main}`,
      maxWidth: "160px",
    },
    singleKey: {
      borderRadius: `${theme.spacing(0.5)}px`,
    },
    value: {
      color: darken(theme.palette.primary.main, 0.7),
      background: emphasize(theme.palette.primary.main, 0.7),
      borderRadius: `0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0`,
      border: `1px solid ${emphasize(theme.palette.primary.main, 0.7)}`,
      maxWidth: "200px",
    },
    imageContainer: {
      maxWidth: "100%",
      width: "fit-content",
    },
    imageKey: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      background: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
      textAlign: "center",
      borderRadius: `${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0 0`,
      width: "100%",
      display: "block",
    },
    image: {
      border: `1px solid ${emphasize(theme.palette.primary.main, 0.7)}`,
      borderRadius: `0 0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px`,
      maxWidth: "100%",
    },
  }),
);

const imageExtensions = [
  ".PNG",
  ".JPG",
  ".JPEG",
  ".GIF",
  ".WEBP",
  ".TIFF",
  ".PSD",
  ".RAW",
  ".BMP",
  ".HEIF",
  ".INDD",
  ".SVG",
];

interface KeyProps {
  name: string;
  value?: string;
  onClick?: () => void;
}

const useLinkPolicy = (link: URL | null) => {
  const { linkPolicy } = useConfigurationProvider();

  return React.useMemo(() => {
    if (link === null) {
      return false;
    }
    return shouldAllowLink(linkPolicy, link);
  }, [link, linkPolicy]);
};

const parseURL = (url: string): URL | null => {
  try {
    return newURL(url);
  } catch (e) {
    return null;
  }
};

const KeyValueChip = ({ name, value = "", ...props }: KeyProps) => {
  const classes = useStyles();
  const url = parseURL(value);
  const hasVerifiedLink = useLinkPolicy(url);

  let valueEl;
  if (url && hasVerifiedLink) {
    // if URL is an image use special img container
    if (
      imageExtensions.some((ext) => url.pathname.toUpperCase().endsWith(ext))
    ) {
      return (
        <Typography component="div" className={classes.root} variant="body2">
          <div className={classes.imageContainer}>
            <div
              className={classNames(classes.base, classes.imageKey)}
              {...props}
            >
              {name}
            </div>
            <div {...props}>
              <img className={classes.image} src={value} alt={value} />
            </div>
          </div>
        </Typography>
      );
    }

    // otherwise display as a link
    valueEl = <AutoLink value={value} {...props} />;
  }

  if (!valueEl) {
    valueEl = <span {...props}>{value}</span>;
  }

  return (
    <Typography component="span" className={classes.root} variant="body2">
      <span
        className={classNames(
          classes.base,
          classes.key,
          value ? null : classes.singleKey,
        )}
        {...props}
      >
        {name}
      </span>
      {value && (
        <span className={classNames(classes.base, classes.value)}>
          {valueEl}{" "}
        </span>
      )}
    </Typography>
  );
};

export default React.memo(KeyValueChip);
