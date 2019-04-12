import React from "/vendor/react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { withApollo } from "/vendor/react-apollo";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from "/vendor/@material-ui/core";

import invalidateTokens from "/lib/mutation/invalidateTokens";

class AuthInvalidDialog extends React.PureComponent {
  static propTypes = {
    // fullScreen prop is controlled by the `withMobileDialog` enhancer.
    fullScreen: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
  };

  render() {
    const { fullScreen, client } = this.props;

    return (
      <Dialog open fullScreen={fullScreen}>
        <DialogTitle>Session Expired</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your session has expired. Please sign in to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              invalidateTokens(client);
            }}
            color="primary"
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose(
  withMobileDialog({ breakpoint: "xs" }),
  withApollo,
)(AuthInvalidDialog);
