import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography, Link } from "/vendor/@material-ui/core";
import { emphasize } from "/vendor/@material-ui/core/styles/colorManipulator";
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
  },
  value: {
    color: theme.palette.text.primary,
    background: emphasize(theme.palette.primary.main, 0.7),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: `0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0`,
  },
  fwKey: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    background: theme.palette.primary.main,
    textAlign: "center",
    borderRadius: `${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0 0`,
  },
  image: {
    borderRadius: `0 0 ${theme.spacing(0.5)} ${theme.spacing(0.5)}`,
    display: "block",
  },
  icon: {
    paddingLeft: theme.spacing(0.3),
    verticalAlign: "middle",
    fontSize: "18px",
  },
});

class Label extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  parseLink = (value, name) => {
    try {
      new URL(value);
      // TODO make sure to have a list of all different image file types,
      // then do the fetch request after to be sure
      if (value.includes("jpg")) {
        return (
          <div>
            <div className={this.props.classes.fwKey}>{name}</div>
            <div>
              <img
                className={this.props.classes.image}
                src={value}
                alt={"bunny"}
              />
            </div>
          </div>
        );
      }
      // fetch(value).then(response => console.log(response));
    } catch (e) {
      return (
        <div>
          <span className={this.props.classes.key}>{name}</span>
          <span className={this.props.classes.value}>{value}</span>;
        </div>
      );
    }
    return (
      <div>
        <span className={this.props.classes.key}>{name}</span>
        <span className={this.props.classes.value}>
          <Link href={value}>
            {value}
            <LinkIcon className={this.props.classes.icon} />
          </Link>
        </span>
      </div>
    );
  };

  render() {
    const { classes, name, value } = this.props;
    return (
      <Typography component="span" className={classes.root}>
        {this.parseLink(value, name)}
      </Typography>
    );
  }
}

export default withStyles(styles)(Label);
