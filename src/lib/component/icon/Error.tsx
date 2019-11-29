import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";
import IconGap from "./IconGap";

interface Props {
  withGap?: boolean;
}

const Icon = React.memo(({ withGap = false, ...props }: Props) => {
  return (
    <SvgIcon {...props}>
      <IconGap disabled={!withGap}>
        {({ maskId }) => (
          <g fill="none" fillRule="evenodd" mask={maskId && `url(#${maskId})`}>
            <path d="M0 0h24v24H0z" />
            <path
              d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
              fillRule="nonzero"
            />
          </g>
        )}
      </IconGap>
    </SvgIcon>
  );
});
Icon.displayName = "ErrorIcon";

export default Icon;
