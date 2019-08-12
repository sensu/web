import React from "/vendor/react";
import PropTypes from "prop-types";
import { Link } from "/vendor/react-router-dom";

import {
  withStyles,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
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
    namespaces: PropTypes.object,
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
        {Object.keys(groups).map((key, i) => {
          const namespaces = groups[key];

          return (
            <React.Fragment key={`prefix-${key}`}>
              {namespaces.map(namespace => (
                <Link
                  key={namespace.name}
                  to={`/${namespace.name}`}
                  onClick={onClick}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <NamespaceIcon namespace={namespace} size={24} />
                    </ListItemIcon>
                    <ListItemText inset primary={namespace.name} />
                  </MenuItem>
                </Link>
              ))}

              {i + 1 < groups.length && <Divider />}
            </React.Fragment>
          );
        })}
      </Menu>
    );
  }
}

export default withStyles(styles)(NamespaceSelectorMenu);
