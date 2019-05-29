import React from "/vendor/react";
import PropTypes from "prop-types";
import lowerFirst from "lodash/lowerFirst";
import { Tooltip } from "/vendor/@material-ui/core";

import { format } from "/lib/util/cron";

const CronDescriptor = ({ capitalize, expression, component: Component }) => {
  let statement = React.useMemo(() => {
    try {
      return format(expression);
    } catch (e) {
      // The cron expression could not be formatted, return the raw expression
      // as a fallback.
      return expression;
    }
  }, [expression]);

  if (!capitalize) {
    statement = lowerFirst(statement);
  }

  return (
    <Tooltip title={expression}>
      <Component>{statement}</Component>
    </Tooltip>
  );
};

CronDescriptor.propTypes = {
  capitalize: PropTypes.bool,
  expression: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

CronDescriptor.defaultProps = {
  capitalize: false,
  component: "span",
};

export default CronDescriptor;
