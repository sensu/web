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
        <g transform="translate(11 7)" fill="none" fillRule="evenodd">
          <path fill="#D8D8D8" d="M21 21l21 62H0z" />
          <g transform="translate(4)">
            <ellipse fill="#EFEFEF" cx="5" cy="19.5" rx="5" ry="19.5" />
            <ellipse fill="#EFEFEF" cx="28.1" cy="19.5" rx="5" ry="19.5" />
            <ellipse fill="#F297A9" cx="29.1" cy="19.5" rx="2.8" ry="16.3" />
            <ellipse fill="#F297A9" cx="3.9" cy="21.1" rx="2.8" ry="17.9" />
          </g>
          <ellipse fill="#EFEFEF" cx="20.5" cy="31.7" rx="15.4" ry="15.3" />
          <g transform="translate(12 26)">
            <ellipse fill="#000" cx="2.3" cy="3.3" rx="2.2" ry="3.2" />
            <ellipse fill="#000" cx="16.7" cy="3.3" rx="2.2" ry="3.2" />
            <path
              fill="#414141"
              fillRule="nonzero"
              d="M9 11l1.4-1.6-2.7-2.2-1.3 1.5zM9 12.5c.5-.2 1 .3 1.4 1.5l-3.7 3.4L5.3 16c2-2.1 3.2-3.3 3.7-3.5z"
            />
            <path
              fill="#414141"
              fillRule="nonzero"
              d="M10 12.5L8.6 14l3.7 3.4 1.4-1.4zM10 11L8.5 9.4l2.7-2.2 1.3 1.5z"
            />
            <path fill="#414141" fillRule="nonzero" d="M10.5 8.6h-2V15h2z" />
          </g>
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Rabbit";

export default Icon;
