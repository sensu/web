import React from "/vendor/react";
import PropTypes from "prop-types";

import { WithNavigation } from "/lib/component/util";

import Button from "./Button";

class QuickNav extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = { className: "" };

  render() {
    const { className } = this.props;

    return (
      <WithNavigation>
        {links => (
          <div className={className}>
            {links.map(({ icon, caption, to }) => (
              <Button key={to} Icon={icon} caption={caption} to={to} />
            ))}
          </div>
        )}
      </WithNavigation>
    );
  }
}

export default QuickNav;
