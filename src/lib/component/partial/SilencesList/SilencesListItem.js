import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Hidden,
  IconButton,
  Slide,
  TableCell,
  Tooltip,
} from "/vendor/@material-ui/core";

import { NotesIcon } from "/lib/component/icon";

import { Maybe } from "/lib/component/util";
import { ModalController, HoverController } from "/lib/component/controller";
import { RelativeToCurrentDate } from "/lib/component/base";

import { UnsilenceMenuItem } from "/lib/component/partial/ToolbarMenuItems";

import ResourceDetails from "/lib/component/partial/ResourceDetails";
import SilenceExpiration from "/lib/component/partial/SilenceExpiration";
import TableOverflowCell from "/lib/component/partial/TableOverflowCell";
import TableSelectableRow from "/lib/component/partial/TableSelectableRow";
import { FloatingTableToolbarCell } from "/lib/component/partial/TableToolbarCell";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import UserAvatar from "/lib/component/partial/UserAvatar";

const SlideUp = props => <Slide {...props} direction="up" />;

const RightAlign = props => (
  <div
    {...props}
    style={{
      display: "flex",
      justifyContent: "flex-end",
    }}
  />
);

class SilencesListItem extends React.Component {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    silence: PropTypes.object.isRequired,
    hovered: PropTypes.bool.isRequired,
    onHover: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    onClickClearSilences: PropTypes.func.isRequired,
    onClickSelect: PropTypes.func.isRequired,
  };

  static fragments = {
    silence: gql`
      fragment SilencesListItem_silence on Silenced {
        ...SilenceExpiration_silence
        name
        begin
        reason
        creator
      }

      ${SilenceExpiration.fragments.silence}
    `,
  };

  renderDetails = () => {
    const { silence } = this.props;

    if (new Date(silence.begin) > new Date()) {
      return (
        <React.Fragment>
          Takes effect{" "}
          <strong>
            <RelativeToCurrentDate dateTime={silence.begin} />
          </strong>
          .
        </React.Fragment>
      );
    }

    return <SilenceExpiration silence={silence} />;
  };

  render() {
    const { editable, editing, silence, selected, onClickSelect } = this.props;

    return (
      <HoverController onHover={this.props.onHover}>
        <TableSelectableRow selected={selected}>
          {editable && (
            <TableCell padding="checkbox">
              <Checkbox
                checked={selected}
                onChange={() => onClickSelect(!selected)}
              />
            </TableCell>
          )}

          <TableOverflowCell>
            <ResourceDetails
              title={<strong>{silence.name}</strong>}
              details={this.renderDetails()}
            />
          </TableOverflowCell>

          <Hidden only="xs">
            <TableCell
              padding="none"
              style={{
                // TODO: magic number
                paddingTop: 8, // one spacing unit
              }}
            >
              <Maybe value={silence.creator}>
                {creator => (
                  <Chip
                    avatar={
                      <Avatar>
                        <UserAvatar username={creator} />
                      </Avatar>
                    }
                    label={creator}
                    style={{
                      // TODO: ideally have Chip scale to current fontSize(?)
                      transform: "scale(0.87)",
                    }}
                  />
                )}
              </Maybe>
            </TableCell>
          </Hidden>

          <FloatingTableToolbarCell
            hovered={this.props.hovered}
            disabled={!editable || editing}
          >
            {() => (
              <RightAlign>
                {silence.reason && (
                  <ModalController
                    renderModal={({ close }) => (
                      <Dialog
                        open
                        fullWidth
                        TransitionComponent={SlideUp}
                        onClose={close}
                      >
                        <DialogTitle>Reason Given</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            {silence.reason}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={close} color="contrast">
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    )}
                  >
                    {({ open }) => (
                      <Tooltip title="Reason">
                        <IconButton onClick={open}>
                          <NotesIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ModalController>
                )}

                <ToolbarMenu>
                  <ToolbarMenu.Item key="delete" visible="never">
                    <UnsilenceMenuItem
                      onClick={this.props.onClickClearSilences}
                    />
                  </ToolbarMenu.Item>
                </ToolbarMenu>
              </RightAlign>
            )}
          </FloatingTableToolbarCell>
        </TableSelectableRow>
      </HoverController>
    );
  }
}

export default SilencesListItem;
