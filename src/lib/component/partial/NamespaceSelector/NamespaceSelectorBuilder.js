import React from "/vendor/react";
import PropTypes from "prop-types";
import classNames from "/vendor/classnames";
import { withStyles, Typography } from "/vendor/@material-ui/core";

import { ArrowDropDownIcon } from "/lib/component/icon";

const styles = theme => ({
  label: {
    color: theme.palette.primary.contrastText,
    opacity: 0.9,
    display: "block",
  },
  heavier: {
    fontWeight: 400,
  },
  lighter: {
    fontWeight: 300,
    opacity: 0.71,
  },
  nameLabel: {
    fontSize: "1.25rem",
  },
  nameContainer: {
    margin: "-6px 0 0",
    display: "flex",
    justifyContent: "space-between",
  },
  arrow: {
    color: theme.palette.primary.contrastText,
  },
});

class NamespaceSelectorBuilder extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    namespace: PropTypes.object,
  };

  static defaultProps = {
    namespace: null,
  };

  render() {
    const { classes, namespace } = this.props;

    const nsComponents = namespace.name.split("-");

    return (
      <div className={classes.selectorContainer}>
        <div className={classes.nameContainer}>
          <Typography
            className={classNames(classes.label, classes.nameLabel)}
            variant="subtitle1"
          >
            {nsComponents.length > 1 && (
              <React.Fragment>
                <span className={classes.lighter}>{nsComponents.shift()}</span>
                {" - "}
              </React.Fragment>
            )}
            <span className={classes.heavier}>{nsComponents.join("-")}</span>
          </Typography>
          <span className={classes.arrow}>
            <ArrowDropDownIcon />
          </span>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(NamespaceSelectorBuilder);
