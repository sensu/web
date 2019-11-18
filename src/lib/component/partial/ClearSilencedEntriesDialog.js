import React, { useState, useCallback } from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  darken,
  fade,
  lighten,
} from "/vendor/@material-ui/core/styles/colorManipulator";

import {
  withStyles,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  Typography,
} from "/vendor/@material-ui/core";

import { DialogContentParagraph, Loader } from "/lib/component/base";
import { useBreakpoint, Maybe } from "/lib/component/util";
import { ListController } from "/lib/component/controller";

import ResourceDetails from "/lib/component/partial/ResourceDetails";
import SilenceExpiration from "/lib/component/partial/SilenceExpiration";
import TableOverflowCell from "/lib/component/partial/TableOverflowCell";
import TableSelectableRow from "/lib/component/partial/TableSelectableRow";

const StyledTable = withStyles(theme => ({
  root: {
    // https://github.com/mui-org/material-ui/blob/a207808/packages/material-ui/src/TableCell/TableCell.js#L13-L14
    borderTop: `1px solid ${
      theme.palette.type === "light"
        ? lighten(fade(theme.palette.divider, 1), 0.88)
        : darken(fade(theme.palette.divider, 1), 0.8)
    }`,
  },
}))(Table);

const ClearSilencedEntriesDialog = ({ onClose, onSave, open, silences: silencesProp }) => {
  const [submitting, setSubmitting] = useState(false);
  const fullScreen = !useBreakpoint("sm", "gt");

  const clearItems = useCallback(items => {
    const done = () => setSubmitting(false);
    const clear = ({ id }) => onSave({ id });

    setSubmitting(true);
    Promise.all(items.map(clear))
      .then(done)
      .then(onClose)
      .catch(done);
  }, [onClose, onSave, setSubmitting]);

  const renderListItem = useCallback(({ key, item: silence, selected, setSelected }) => (
    <TableSelectableRow
      selected={selected}
      key={key}
      style={{ verticalAlign: "middle", cursor: "pointer" }}
      onClick={() => setSelected(!selected)}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={selected}
          onChange={e => setSelected(e.target.checked)}
        />
      </TableCell>
      <TableOverflowCell>
        <ResourceDetails
          title={silence.name}
          details={<SilenceExpiration silence={silence} />}
        />
      </TableOverflowCell>
      <TableCell>
        <ResourceDetails
          title={<Maybe value={silence.creator} fallback="Unspecified" />}
        />
      </TableCell>
    </TableSelectableRow>
  ), []);

  const renderEmpty = useCallback(() => (
    <DialogContent>
      <DialogContentParagraph>
        {`There doesn't seem to be anything here. This may occur when
        the silence(s) have already been cleared or have expired.`}
      </DialogContentParagraph>
    </DialogContent>
  ), []);

    // omit duplicates
    const silences = Object.values(
      (silencesProp || [])
        .filter(sl => !sl.deleted)
        .reduce((memo, sl) => Object.assign({ [sl.name]: sl }, memo), {}),
    );

    return (
      <Dialog fullWidth fullScreen={fullScreen} open={open} onClose={onClose}>
        <ListController
          items={silences}
          initialSelectedKeys={silences.map(silence => silence.name)}
          getItemKey={node => node.name}
          renderEmptyState={renderEmpty}
          renderItem={renderListItem}
        >
          {({ children, selectedItems }) => (
            <Loader loading={submitting} passthrough>
              <DialogTitle>Clear Silencing Entries</DialogTitle>
              <Typography style={{ paddingLeft: "24px", paddingBottom: "8px" }}>
                Select all entries you would like to clear.
              </Typography>
              <DialogContent style={{ paddingLeft: 0, paddingRight: 0 }}>
                <StyledTable>
                  <TableBody>{children}</TableBody>
                </StyledTable>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} color="default">
                  Cancel
                </Button>
                <Button
                  onClick={() => clearItems(selectedItems)}
                  color="primary"
                  variant="contained"
                  autoFocus
                  disabled={selectedItems.length === 0 || submitting}
                >
                  Clear
                </Button>
              </DialogActions>
            </Loader>
          )}
        </ListController>
      </Dialog>
    );
}

ClearSilencedEntriesDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool,
  silences: PropTypes.array,
};

ClearSilencedEntriesDialog.defaultProps = {
  open: false,
  silences: null,
};

ClearSilencedEntriesDialog.fragments = {
  silence: gql`
    fragment ClearSilencedEntriesDialog_silence on Silenced {
      ...SilenceExpiration_silence

      id
      deleted @client
      name
      creator
    }

    ${SilenceExpiration.fragments.silence}
  `,
};

export default ClearSilencedEntriesDialog;
