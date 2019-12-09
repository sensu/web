import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";
import Bg from "./Bg";

interface Props {
  color: string;
}

const Icon = React.memo(({ color, ...props }: Props) => {
  return (
    <SvgIcon viewBox="0 0 64 64" {...props}>
      <Bg color={color}>
        <g transform="translate(2 38)">
          <ellipse fill="#714E2C" cx="30.5" cy="20.4" rx="30.5" ry="20.4" />
          <ellipse fill="#916C47" cx="28.9" cy="26.1" rx="12.5" ry="9.1" />
        </g>
        <g transform="translate(9 11)">
          <ellipse fill="#916C47" cx="23.2" cy="22.1" rx="18.7" ry="16.4" />
          <ellipse fill="#916C47" cx="37.4" cy="7.4" rx="7.9" ry="7.4" />
          <ellipse fill="#916C47" cx="7.9" cy="7.4" rx="7.9" ry="7.4" />
          <ellipse fill="#AC8157" cx="7.4" cy="9.1" rx="4" ry="3.4" />
          <ellipse fill="#AC8157" cx="38" cy="9.1" rx="4" ry="3.4" />
          <g transform="translate(18 25)" fill="#333">
            <ellipse cx="5.1" cy="2.3" rx="5.1" ry="2.3" />
            <path fillRule="nonzero" d="M4 4h2v3l4 4-2 1-3-3-3 3-2-1 4-4z" />
          </g>
          <circle fill="#000" cx="30.6" cy="21.5" r="2.3" />
          <circle fill="#000" cx="15.9" cy="21.5" r="2.3" />
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Bear";

export default Icon;
