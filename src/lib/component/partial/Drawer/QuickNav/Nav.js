import React from "/vendor/react";
import PropTypes from "prop-types";

import { WithNavigation } from "/lib/component/util";
import { MenuIcon } from "/lib/component/icon";

import Button from "./Button";
import UnlabelledButton from "./UnlabelledButton";

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
        <UnlabelledButton aria-label="Menu" onClick={this.expand}>
          <MenuIcon />
        </UnlabelledButton>
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
