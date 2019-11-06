import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fillRule="evenodd">
        <path d="M11.7 1.7S8.3 4 2.7 4c0 0-.4 7.1 1.5 11.2 1.3 2.8 3.7 5.2 7.5 6.6v-20z" />
        <path
          d="M11.7 1.8s3.5 2.1 9 2.1c0 0 .4 7.1-1.4 11.2a12.7 12.7 0 0 1-7.6 6.6v-20z"
          opacity=".71"
        />
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "ShieldIcon";

export default Icon;
