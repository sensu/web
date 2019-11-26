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
            <g fill="currentColor" mask={maskId && `url(#${maskId})`}>
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </g>
          )}
        </IconGap>
      </SvgIcon>
    );
  }
}

export default Icon;
