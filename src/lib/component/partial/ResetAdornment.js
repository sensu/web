import React from "/vendor/react";
import PropTypes from "prop-types";

import { InputAdornment, IconButton } from "/vendor/@material-ui/core";

import { UndoIcon } from "/lib/component/icon";

class ResetAdornment extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: undefined,
  };

  render() {
    const { onClick } = this.props;

    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="reset field to initial value"
          onClick={onClick}
          onMouseDown={event => event.preventDefault()}
        >
          <UndoIcon />
        </IconButton>
      </InputAdornment>
    );
  }
}

export default ResetAdornment;
