import React from "/vendor/react";
import PropTypes from "prop-types";
import { Menu as BaseMenu } from "/vendor/@material-ui/core";

class Menu extends React.Component {
  static displayName = "ToolbarSelect.Menu";

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    anchorEl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    orient: PropTypes.bool,
  };

  static defaultProps = {
    orient: "left",
  };

  render() {
    const { anchorEl, children, onClose, onChange, orient } = this.props;

    return (
      <BaseMenu
        open
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: orient }}
      >
        {React.Children.map(children, child => {
          const onClick = event => {
            if (child.props.onClick) {
              child.props.onClick(event);
              if (event.defaultPrevented) {
                return;
              }
            }

            if (child.props.value !== undefined) {
              onChange(child.props.value);
            }

            onClose();
          };

          return React.cloneElement(child, { onClick });
        })}
      </BaseMenu>
    );
  }
}

export default Menu;
