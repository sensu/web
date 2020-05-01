import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <path
        d="M18 2a4 4 0 014 4v12a4 4 0 01-4 4H6a4 4 0 01-4-4V6a4 4 0 014-4h12zm0 2H6a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2V6a2 2 0 00-2-2zm-6.3 10c.5 0 .8-.2.9-.6 0-.6.3-1 1.2-1.4 1-.6 1.4-1.3 1.4-2.3C15.2 8 14 7 12 7c-1.5 0-2.6.6-3 1.5-.2.2-.2.5-.2.8 0 .5.3.9.8.9s.8-.2 1-.7c.2-.6.6-1 1.3-1 .7 0 1.3.6 1.3 1.2s-.3 1-1 1.4l-.2.1c-.8.5-1.2 1-1.2 1.8v.1c0 .6.3 1 1 1zm0 3.1a1 1 0 01-1-1c0-.7.4-1.1 1-1.1a1 1 0 011.1 1c0 .7-.5 1.1-1 1.1z"
        fillRule="evenodd"
      />
    </SvgIcon>
  );
});
Icon.displayName = "MissingIcon";

export default Icon;
