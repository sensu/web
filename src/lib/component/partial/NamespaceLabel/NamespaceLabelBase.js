import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "/vendor/@material-ui/core";

// TODO: Clean up the exports of NamespaceIcon
import Icon from "/lib/component/partial/NamespaceIcon/Icon";

class NamespaceLabelBase extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    colour: PropTypes.string.isRequired,
  };

  static styles = theme => ({
    container: {
      display: "flex",
      alignSelf: "center",
    },
    label: {
      color: "inherit",
      marginRight: theme.spacing(1),
      opacity: 0.88,
    },
    heavier: {
      fontWeight: 400,
    },
    lighter: {
      fontWeight: 300,
      opacity: 0.71,
    },
  });

  render() {
    const { classes, name, icon, colour } = this.props;

    return (
      <div className={classes.container}>
        <Typography className={classes.label} variant="subtitle1">
          {name}
        </Typography>

        <Icon icon={icon} colour={colour} />
      </div>
    );
  }
}

const enhancer = withStyles(NamespaceLabelBase.styles);
export default enhancer(NamespaceLabelBase);
