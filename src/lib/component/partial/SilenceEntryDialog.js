import React from "/vendor/react";
import PropTypes from "prop-types";

import {
  withStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "/vendor/@material-ui/core";

import { useCreateSilenceStatusToast } from "/lib/component/toast";
import { Loader } from "/lib/component/base";
import { useBreakpoint, DocumentationLink } from "/lib/component/util";
import {
  SilenceEntryForm,
  SilenceEntryFormFields,
} from "/lib/component/partial/SilenceEntryForm";

const StyledDialogContentText = withStyles(() => ({
  root: { marginBottom: "2rem" },
}))(DialogContentText);

const SilenceEntryDialog = props => {
  const { onClose, values, onSave } = props;
  const fullScreen = !useBreakpoint("sm", "gt");
  const createToast = useCreateSilenceStatusToast();

  return (
    <SilenceEntryForm
      values={values}
      onSubmitSuccess={onClose}
      onCreateSilence={onSave}
      onCreateSilenceSuccess={() => {
        createToast({ namespace: values.namespace });
      }}
      onCreateSilenceFailure={error => {
        createToast({ namespace: values.namespace, error });
        onClose();
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
                  <DocumentationLink path="/reference/silencing/">
                    Learn more
                  </DocumentationLink>
                </StyledDialogContentText>
                <div>
                  <SilenceEntryFormFields />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={close}>
                  Cancel
                </Button>
                <Button
                  autoFocus
                  color="primary"
                  disabled={hasErrors || submitting}
                  onClick={submit}
                  variant="contained"
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
};

SilenceEntryDialog.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  values: PropTypes.object,
};

SilenceEntryDialog.defaultProps = {
  onClose: undefined,
  values: {},
};

export default SilenceEntryDialog;
