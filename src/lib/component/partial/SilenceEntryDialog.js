import React from "/vendor/react";
import PropTypes from "prop-types";
import { withApollo } from "/vendor/react-apollo";

import {
  withStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from "/vendor/@material-ui/core";

import compose from "/lib/util/compose";

import createSilence from "/lib/mutation/createSilence";

import { Loader } from "/lib/component/base";

import {
  SilenceEntryForm,
  SilenceEntryFormFields,
} from "/lib/component/partial/SilenceEntryForm";

const StyledDialogContentText = withStyles(() => ({
  root: { marginBottom: "2rem" },
}))(DialogContentText);

class SilenceEntryDialog extends React.PureComponent {
  static propTypes = {
    // fullScreen prop is controlled by the `withMobileDialog` enhancer.
    fullScreen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    values: PropTypes.object,
    client: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onClose: undefined,
    values: {},
  };

  render() {
    const { fullScreen, onClose, values, client } = this.props;

    return (
      <SilenceEntryForm
        values={values}
        onSubmitSuccess={onClose}
        onCreateSilence={input => createSilence(client, input)}
        onCreateSilenceSuccess={silences => {
          // TODO: Show success banner or toast notification
          // eslint-disable-next-line no-console
          console.log("Created silencing entries", silences);
        }}
      >
        {({ submit, hasErrors, submitting }) => {
          const close = () => {
            if (!submitting) {
              onClose();
            }
          };

          return (
            <Dialog open fullScreen={fullScreen} onClose={close}>
              <Loader loading={submitting} passthrough>
                <DialogTitle>New Silencing Entry</DialogTitle>
                <DialogContent>
                  <StyledDialogContentText>
                    Create a silencing entry to temporarily prevent check result
                    handlers from being triggered. A full reference to check
                    silencing is available on the Sensu docs site.
                    <br />
                    <a
                      href="https://docs.sensu.io/sensu-core/2.0/reference/silencing/"
                      target="_docs"
                    >
                      Learn more
                    </a>
                  </StyledDialogContentText>
                  <div>
                    <SilenceEntryFormFields />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={close} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      submit();
                    }}
                    color="primary"
                    variant="contained"
                    autoFocus
                    disabled={hasErrors || submitting}
                  >
                    Create
                  </Button>
                </DialogActions>
              </Loader>
            </Dialog>
          );
        }}
      </SilenceEntryForm>
    );
  }
}

export default compose(
  withApollo,
  withMobileDialog({ breakpoint: "xs" }),
)(SilenceEntryDialog);
