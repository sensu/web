import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fillRule="evenodd">
        <path d="M6.5 6.5l2.67 2.67a4 4 0 0 0 5.66 0l2.66-2.66a1.76 1.76 0 0 1 3.01 1.24v8.5a1.76 1.76 0 0 1-3 1.24l-2.67-2.66a4 4 0 0 0-5.66 0l-2.66 2.66a1.76 1.76 0 0 1-3.01-1.24v-8.5a1.76 1.76 0 0 1 3-1.24z" />
        <path
          d="M17.5 6.5l-3.38 3.38a3 3 0 0 0 0 4.24l3.37 3.37a1.76 1.76 0 0 1-1.24 3.01h-8.5a1.76 1.76 0 0 1-1.24-3l3.37-3.38a3 3 0 0 0 0-4.24L6.5 6.5A1.76 1.76 0 0 1 7.75 3.5h8.5a1.76 1.76 0 0 1 1.24 3z"
          opacity=".5"
        />
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "GlassesIcon";

export default Icon;
