import React from "/vendor/react";
import { useTheme } from "/vendor/@material-ui/styles";
import { Theme, getColor } from "./util";

export interface BarProps extends React.SVGProps<SVGRectElement> {
  status: number;
}

const Bar = ({ status, ...extra }: BarProps) => {
  const theme = useTheme() as Theme;
  const color = getColor(theme.palette, status);

  return <rect fill={color} {...extra} />;
};
Bar.displayName = "CheckTimeline.Bar";

export default Bar;
