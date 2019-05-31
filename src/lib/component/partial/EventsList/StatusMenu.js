import React from "/vendor/react";
import PropTypes from "prop-types";
import capitalizeStr from "lodash/capitalize";

import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "/vendor/@material-ui/core";

import { CheckStatusIcon } from "/lib/component/base";
import { ErrorHollowIcon } from "/lib/component/icon";

const options = [
  {
    value: "incident",
    Icon: function IncidentIcon() {
      return <ErrorHollowIcon />;
    },
  },
  {
    value: "warning",
    Icon: function WarningIcon() {
      return <CheckStatusIcon statusCode={1} />;
    },
  },
  {
    value: "critical",
    Icon: function CriticalIcon() {
      return <CheckStatusIcon statusCode={2} />;
    },
  },
  {
    value: "unknown",
    Icon: function UnknownIcon() {
      return <CheckStatusIcon statusCode={3} />;
    },
  },
  {
    value: "passing",
    Icon: function PassingIcon() {
      return <CheckStatusIcon statusCode={0} />;
    },
  },
];

class StatusMenu extends React.Component {
  static propTypes = {
    anchorEl: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    selected: PropTypes.string,
  };

  static defaultProps = {
    anchorEl: undefined,
    className: undefined,
    onChange: undefined,
    onClose: undefined,
    selected: undefined,
  };

  render() {
    const { anchorEl, className, onClose, onChange, selected } = this.props;

    return (
      <Menu anchorEl={anchorEl} className={className} onClose={onClose} open>
        <MenuItem onClick={() => onChange(null)} />
        {options.map(({ value, Icon }) => (
          <MenuItem
            key={value}
            onClick={() => onChange(value)}
            selected={selected === value}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={capitalizeStr(value)} />
          </MenuItem>
        ))}
      </Menu>
    );
  }
}

export default StatusMenu;
