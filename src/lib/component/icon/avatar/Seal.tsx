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
        <g transform="translate(7.5 9)">
          <path
            d="M24.5 71.7c13.6 0 24.5-17 24.5-38C49 12.9 38 0 24.5 0S0 12.8 0 33.8c0 21 11 38 24.5 38z"
            fill="#B4B4B4"
          />
          <g transform="translate(13.6 17.7)">
            <ellipse fill="#EFEFEF" cx="5.7" cy="5.7" rx="5.7" ry="4.7" />
            <ellipse fill="#EFEFEF" cx="16.2" cy="5.7" rx="5.7" ry="4.7" />
            <path
              d="M11 4.2c2.5 0 4.7-1.8 4.7-2.6C15.7.7 13.5 0 11 0 8.4 0 6.3.7 6.3 1.6c0 .8 2 2.6 4.7 2.6z"
              fill="#414141"
            />
          </g>
          <g fill="#000" fillRule="nonzero">
            <path d="M12.5 11.5v3.1H21v-3.1zM28.2 11.5v3.1h8.3v-3.1z" />
          </g>
          <ellipse fill="#6C6C6C" cx="44.3" cy="39.7" rx="2.6" ry="3.1" />
          <ellipse fill="#6C6C6C" cx="44.3" cy="30.3" rx="2.6" ry="3.1" />
          <ellipse fill="#6C6C6C" cx="38.1" cy="35.5" rx="2.6" ry="3.1" />
          <ellipse fill="#6C6C6C" cx="4.7" cy="35.5" rx="2.6" ry="3.1" />
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Seal";

export default Icon;
