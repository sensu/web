import React from "/vendor/react";
import PropTypes from "prop-types";
import { Link } from "/vendor/react-router-dom";

import {
  withStyles,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "/vendor/@material-ui/core";

import NamespaceIcon from "/lib/component/partial/NamespaceIcon";

const styles = () => ({
  envIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
  },
});

class NamespaceSelectorMenu extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    namespaces: PropTypes.array,
  };

  static defaultProps = {
    viewer: null,
  };

  render() {
    const { namespaces, classes, onClick, ...props } = this.props;

    const groups = namespaces.reduce((acc, ns) => {
      const [key] = ns.name.split("-", 1);

      acc[key] = acc[key] || [];
      acc[key].push(ns);

      return acc;
    }, {});

    return (
      <Menu {...props}>
        {Object.keys(groups).map(key => {
          const namespaces = groups[key];

          return namespaces.map(namespace => (
            <MenuItem
              component={Link}
              key={namespace.name}
              to={`/${namespace.name}`}
              onClick={onClick}
            >
              <ListItemIcon>
                <NamespaceIcon namespace={namespace} size={24} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography color="textPrimary">{namespace.name}</Typography>
                }
              />
            </MenuItem>
          ));
        })}
      </Menu>
    );
  }
}

export default withStyles(styles)(NamespaceSelectorMenu);
