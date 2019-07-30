import React from "/vendor/react";
import { useCurrentDate } from "/lib/component/util";

import RelativeDate from "./RelativeDate";

interface RelativeToCurrentDateProps {
  refreshInterval: number,
}

const RelativeToCurrentDate = ({ refreshInterval, ...props }: RelativeToCurrentDateProps) => {
  const now = useCurrentDate(refreshInterval || 1000);
  return <RelativeDate to={now} {...props} />;
};

export default RelativeToCurrentDate;
