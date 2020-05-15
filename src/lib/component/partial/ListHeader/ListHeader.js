import React from "/vendor/react";
import PropTypes from "prop-types";
import classnames from "/vendor/classnames";
import {
  withStyles,
  Typography,
  Tooltip,
  Checkbox,
} from "/vendor/@material-ui/core";

import { AppLayoutContext } from "/lib/component/base";

const styles = theme => ({
  root: {
    // This padding is set to match the "checkbox" padding of a <TableCell>
    // component to keep the header checkbox aligned with row checkboxes.
    // See: https://github.com/mui-org/material-ui/blob/3353f44/packages/material-ui/src/TableCell/TableCell.js#L50
    paddingLeft: 4,
    paddingRight: 12,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    zIndex: theme.zIndex.appBar - 1,
    minHeight: theme.spacing(7),
  },
  active: {
    backgroundColor: theme.palette.primary.main,
  },
  sticky: {
    position: "sticky",
    color: theme.palette.primary.contrastText,
  },

  grow: {
    flex: "1 1 auto",
  },
});

class ListHeader extends React.Component {
  static propTypes = {
    editable: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    sticky: PropTypes.bool,

    selectedCount: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
    onClickSelect: PropTypes.func,

    renderActions: PropTypes.func,
    renderBulkActions: PropTypes.func,
  };

  static defaultProps = {
    editable: true,
    sticky: false,
    renderActions: () => {},
    renderBulkActions: () => {},
    onClickSelect: null,
    selectedCount: 0,
  };

  renderCheckbox = () => {
    const { editable, onClickSelect, selectedCount, rowCount } = this.props;

    if (!editable || !onClickSelect) {
      return null;
    }

    return (
      <React.Fragment>
        <Tooltip title="Select">
          <Checkbox
            component="div"
            inputProps={{
              "aria-label": "select all",
            }}
            onClick={onClickSelect}
            checked={rowCount > 0 && selectedCount === rowCount}
            indeterminate={selectedCount > 0 && selectedCount !== rowCount}
            style={{ color: "inherit" }}
          />
        </Tooltip>
        {selectedCount > 0 && <div>{selectedCount} Selected</div>}
      </React.Fragment>
    );
  };

  render() {
    const {
      sticky,
      classes,
      selectedCount,
      renderActions,
      renderBulkActions,
    } = this.props;

    return (
      <AppLayoutContext.Consumer>
        {({ topBarHeight }) => (
          <Typography
            component="div"
            className={classnames(classes.root, {
              [classes.active]: selectedCount > 0,
              [classes.sticky]: sticky,
            })}
            style={{ top: sticky ? topBarHeight : undefined }}
          >
            {this.renderCheckbox()}
            <div className={classes.grow} />
            {selectedCount > 0 ? renderBulkActions() : renderActions()}
          </Typography>
        )}
      </AppLayoutContext.Consumer>
    );
  }
}

export default withStyles(styles)(ListHeader);
