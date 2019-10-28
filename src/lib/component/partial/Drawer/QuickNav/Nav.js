import React from "/vendor/react";
import PropTypes from "prop-types";

import { WithNavigation } from "/lib/component/util";
import { IconButton } from "/vendor/@material-ui/core";

import { MenuIcon } from "/lib/component/icon";
import Button from "./Button";

class QuickNav extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = { className: "" };

  expand = () => {
    this.props.onToggle(true);
  };

  render() {
    const { className } = this.props;

    return (
      <div>
        <IconButton aria-label="Menu" onClick={this.expand}>
          <MenuIcon />
        </IconButton>
        <WithNavigation>
          {links => (
            <div className={className}>
              {links.map(({ icon, caption, to }) => (
                <Button key={to} Icon={icon} caption={caption} to={to} />
              ))}
            </div>
          )}
        </WithNavigation>
      </div>
    );
  }
}

export default QuickNav;
