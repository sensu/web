import React from "/vendor/react";
import PropTypes from "prop-types";

import { WithNavigation } from "/lib/component/util";
import { ButtonIcon } from "/lib/component/base";

import Expand from "@material-ui/icons/KeyboardArrowRight";
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
        <ButtonIcon onClick={this.expand}>
          <Expand />
        </ButtonIcon>
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
