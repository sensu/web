import React from "/vendor/react";
import PropTypes from "prop-types";
import {
  withStyles,
  Button,
  withMobileDialog,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "/vendor/@material-ui/core";

import { ButtonSet } from "/lib/component/base";

const Highlight = withStyles({
  root: {
    display: "inline",
    fontWeight: 600,
  },
})(props => <Typography component="strong" {...props} />);

class ConfirmDeleteDialog extends React.Component {
  static propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    identifier: PropTypes.node,
    open: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    identifier: "this resource",
  };

  render() {
    const titleId = "confirm-delete-dialog-title";

    return (
      <Dialog
        aria-labelledby={titleId}
        disableBackdropClick
        disableEscapeKeyDown
        fullScreen={this.props.fullScreen}
        maxWidth="sm"
        open={this.props.open}
      >
        <DialogTitle id={titleId}>Confirm</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you would like to permenantly delete{" "}
            <Highlight>{this.props.identifier}</Highlight>? This operation{" "}
            <Highlight>cannot</Highlight> be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <ButtonSet>
            <Button onClick={this.props.onClose} color="default">
              Cancel
            </Button>
            <Button
              variant="raised"
              onClick={this.props.onConfirm}
              color="primary"
            >
              Delete
            </Button>
          </ButtonSet>
        </DialogActions>
      </Dialog>
    );
  }
}

const enhancer = withMobileDialog({ breakpoint: "xs" });
export default enhancer(ConfirmDeleteDialog);
