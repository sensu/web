import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography, Link } from "/vendor/@material-ui/core";
import {
  darken,
  emphasize,
} from "/vendor/@material-ui/core/styles/colorManipulator";
import { LinkIcon } from "/lib/component/icon";

const styles = theme => ({
  root: {
    color: emphasize(theme.palette.text.primary, 0.22),
    display: "inline",
    whiteSpace: "nowrap",
  },
  key: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    background: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: `${theme.spacing(0.5)}px 0 0 ${theme.spacing(0.5)}px`,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  value: {
    color: darken(theme.palette.primary.main, 0.7),
    background: emphasize(theme.palette.primary.main, 0.7),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: `0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0`,
    border: `1px solid ${emphasize(theme.palette.primary.main, 0.7)}`,
  },
  imgContainer: {
    maxWidth: "100%",
    width: "fit-content",
  },
  fwKey: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    background: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    textAlign: "center",
    borderRadius: `${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0 0`,
  },
  image: {
    border: `1px solid ${emphasize(theme.palette.primary.main, 0.7)}`,
    borderRadius: `0 0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px`,
    maxWidth: "100%",
  },
  icon: {
    paddingLeft: theme.spacing(0.3),
    verticalAlign: "middle",
    fontSize: "18px",
  },
});

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
  ".SVG.",
];

class Label extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  parseLink = (value, name) => {
    try {
      new URL(value);
      // see if it's got an image extension
      let results = imageExtensions.filter(ext =>
        value.toUpperCase().includes(ext),
      );
      let imageMatch = results.length > 0;
      // if that fails, we should check the content type in case
      if (!imageMatch) {
        fetch(value, {
          method: "HEAD",
        })
          .then(response => response.headers.get("Content-type"))
          .then(type => {
            imageMatch = type === "image/jpeg" ? true : false;
          });
      }
      // return an image
      if (imageMatch) {
        return (
          <div className={this.props.classes.imgContainer}>
            <div className={this.props.classes.fwKey}>{name}</div>
            <div>
              <img
                className={this.props.classes.image}
                src={value}
                alt={value}
              />
            </div>
          </div>
        );
      }
      // return a link
      return (
        <span>
          <span className={this.props.classes.key}>{name}</span>
          <span className={this.props.classes.value}>
            <Link href={value}>
              {value}
              <LinkIcon className={this.props.classes.icon} />
            </Link>
          </span>
        </span>
      );
    } catch (e) {
      // catch if it's not a url, it's a regular value
      return (
        <span>
          <span className={this.props.classes.key}>{name}</span>
          <span className={this.props.classes.value}>{value}</span>
        </span>
      );
    }
  };

  render() {
    const { classes, name, value } = this.props;
    return (
      <Typography component="div" className={classes.root}>
        {this.parseLink(value, name)}
      </Typography>
    );
  }
}

export default withStyles(styles)(Label);
