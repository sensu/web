import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { withApollo } from "/vendor/react-apollo";

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
  withMobileDialog,
} from "/vendor/@material-ui/core";

import compose from "/lib/util/compose";

import deleteSilence from "/lib/mutation/deleteSilence";

import { DialogContentParagraph, Loader } from "/lib/component/base";
import { Maybe } from "/lib/component/util";
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

class ClearSilencedEntriesDialog extends React.PureComponent {
  static propTypes = {
    client: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    fullScreen: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    silences: PropTypes.array,
  };

  static defaultProps = {
    open: false,
    silences: null,
  };

  static fragments = {
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

  state = {
    submitting: false,
  };

  clearItems = items => {
    const { client, close } = this.props;
    const done = () => this.setState({ submitting: false });
    const clear = ({ id }) => deleteSilence(client, { id });

    this.setState({ submitting: true });
    Promise.all(items.map(clear))
      .then(done)
      .then(close)
      .catch(done);
  };

  renderListItem = ({ key, item: silence, selected, setSelected }) => (
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
  );

  renderEmpty = () => (
    <DialogContent>
      <DialogContentParagraph>
        {`There doesn't seem to be anything here. This may occur when
        the silence(s) have already been cleared or have expired.`}
      </DialogContentParagraph>
    </DialogContent>
  );

  render() {
    const { open, close, fullScreen, silences: silencesProp } = this.props;
    const { submitting } = this.state;

    // omit duplicates
    const silences = Object.values(
      (silencesProp || [])
        .filter(sl => !sl.deleted)
        .reduce((memo, sl) => Object.assign({ [sl.name]: sl }, memo), {}),
    );

    return (
      <Dialog fullWidth fullScreen={fullScreen} open={open} onClose={close}>
        <ListController
          items={silences}
          initialSelectedKeys={silences.map(silence => silence.name)}
          getItemKey={node => node.name}
          renderEmptyState={this.renderEmpty}
          renderItem={this.renderListItem}
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
                <Button onClick={close} color="default">
                  Cancel
                </Button>
                <Button
                  onClick={() => this.clearItems(selectedItems)}
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
}

const enhancer = compose(
  withApollo,
  withMobileDialog({ breakpoint: "xs" }),
);
const result = enhancer(ClearSilencedEntriesDialog);

// Manually hoist static fragments property, this is messy bu can eventually
// be removed once more HOC utilities move to React hooks.
result.fragments = ClearSilencedEntriesDialog.fragments;

export default result;
