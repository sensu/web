import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fillRule="evenodd">
        <path
          d="M5.5 3.8a1 1 0 0 1 .5.14l12.23 7.19a1 1 0 0 1 0 1.72l-12.22 7.2a1 1 0 0 1-1.51-.87V4.8a1 1 0 0 1 1-1zm2.13 5.06v6.26L12.95 12 7.63 8.86z"
          opacity=".5"
        />
        <path d="M7.63 8.86L12.95 12l-5.32 3.13z" />
        <path
          d="M15.21 17.37l3.73-2.24a.5.5 0 0 1 .76.43v4.49a.5.5 0 0 1-.76.43l-3.73-2.25a.5.5 0 0 1 0-.86z"
          opacity=".87"
        />
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "TriangleIcon";

export default Icon;
