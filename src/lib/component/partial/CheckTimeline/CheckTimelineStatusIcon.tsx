import React from "/vendor/react";

import { useTheme } from "/vendor/@material-ui/styles";
import { ErrorIcon, SmallCheckIcon, WarnIcon } from "/lib/component/icon";
import { Theme, getFontOpacity } from "./util";

export interface StatusIconProps extends React.SVGProps<SVGSVGElement> {
  status: number;
  style?: object;
}

const getComponent = (status: number) => {
  if (status === 0) {
    return SmallCheckIcon;
  } else if (status === 1) {
    return WarnIcon;
  }
  return ErrorIcon;
};

const StatusIcon = React.memo(
  ({ status, style = {}, ...extra }: StatusIconProps) => {
    const theme: Theme = useTheme();
    const opacity = getFontOpacity(theme.palette, status);
    const Component = getComponent(status) as React.ComponentType<
      React.SVGProps<SVGSVGElement>
    >;

    return (
      <Component
        style={{ ...style, color: `rgba(255,255,255,${opacity})` }}
        {...extra}
      />
    );
  },
);
StatusIcon.displayName = "CheckTimeline.StatusIcon";

export default StatusIcon;
