import React from "/vendor/react";
import PropTypes from "prop-types";
import { SvgIcon } from "/vendor/@material-ui/core";
import IconGap from "./IconGap";

interface Props {
  withGap?: boolean;
}

class Icon extends React.PureComponent<Props> {
  static propTypes = {
    withGap: PropTypes.bool,
  };

  static defaultProps = {
    withGap: false,
  };

  render() {
    const { withGap, ...props } = this.props;

    return (
      <SvgIcon {...props}>
        <IconGap disabled={!withGap}>
          {({ maskId }) => (
            <g mask={maskId && `url(#${maskId})`}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </g>
          )}
        </IconGap>
      </SvgIcon>
    );
  }
}

export default Icon;
