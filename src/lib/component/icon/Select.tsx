import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fill="currentColor" transform="translate(6 3)">
        <path d="M10.6 10.6L12 12l-6 6-6-6 1.4-1.4L6 15.2l4.6-4.6zM6 0l6 6-1.4 1.4L6 2.8 1.4 7.4 0 6l6-6z" />
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "SelectIcon";

export default Icon;
