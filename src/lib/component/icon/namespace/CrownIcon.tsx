import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fillRule="evenodd">
        <path d="M15.6 11.6L21 6.2l-1.8 9.9H4.8L3 6.2l5.4 5.4 3.6 4.5 3.6-4.5zm-10.8 6h14.4v2.7H4.8v-2.7z" />
        <path
          opacity=".71"
          d="M3 6.2l5.4 5.4L12 3.5l3.6 8.1L21 6.2l-1.8 9.9H4.8z"
        />
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "CrownIcon";

export default Icon;
