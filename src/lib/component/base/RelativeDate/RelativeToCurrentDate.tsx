import React from "/vendor/react";
import { useCurrentDate } from "/lib/component/util";

import RelativeDate from "./RelativeDate";

interface Props {
  refreshInterval?: number;
  dateTime: string;
}

const RelativeToCurrentDate = ({ refreshInterval, ...props }: Props) => {
  const now = useCurrentDate(refreshInterval || 1000);
  return <RelativeDate to={now} {...props} />;
};

export default RelativeToCurrentDate;
