import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  DeleteMenuItem,
  QueueExecutionMenuItem,
  ResolveMenuItem,
  SilenceMenuItem,
  UnsilenceMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import Toolbar from "/lib/component/partial/Toolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

import ClearSilenceAction from "/lib/component/partial/ClearSilenceAction";
import DeleteAction from "./EventDetailsDeleteAction";
import ResolveAction from "./EventDetailsResolveAction";
import ReRunAction from "./EventDetailsReRunAction";
import SilenceAction from "./EventDetailsSilenceAction";

class EventDetailsToolbar extends React.Component {
  static propTypes = {
    event: PropTypes.object,
    loading: PropTypes.bool,
    refetch: PropTypes.func,
    toolbarItems: PropTypes.func,
    onCreateSilence: PropTypes.func.isRequired,
    onDeleteSilence: PropTypes.func.isRequired,
    onResolve: PropTypes.func.isRequired,
    onExecute: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    event: undefined,
    loading: false,
    refetch: () => null,
    toolbarItems: ({ items }) => items,
  };

  static fragments = {
    event: gql`
      fragment EventDetailsToolbar_event on Event {
        ...EventDetailsDeleteAction_event
        ...EventDetailsResolveAction_event
        ...EventDetailsReRunAction_event
        ...EventDetailsSilenceAction_event
        ...ClearSilenceAction_record
        isSilenced
      }

      ${DeleteAction.fragments.event}
      ${ResolveAction.fragments.event}
      ${ReRunAction.fragments.event}
      ${SilenceAction.fragments.event}
      ${ClearSilenceAction.fragments.record}
    `,
  };

  render() {
    const {
      event: eventProp,
      loading,
      refetch,
      toolbarItems,
      onCreateSilence,
      onDeleteSilence,
      onResolve,
      onExecute,
      onDelete,
    } = this.props;
    const event = eventProp || {check: {}, entity: {}};

    return (
      <Toolbar
        right={
          <ToolbarMenu fillWidth>
            {toolbarItems({
              items: [
                <ToolbarMenu.Item key="resolve" visible="always">
                  <ResolveAction event={event} onResolve={onResolve}>
                    {({ resolve, canResolve }) => (
                      <ResolveMenuItem
                        disabled={loading || !canResolve}
                        onClick={resolve}
                      />
                    )}
                  </ResolveAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item key="re-run" visible="if-room">
                  <ReRunAction event={event} onExecute={onExecute}>
                    {({ runCheck, canRunCheck }) => (
                      <QueueExecutionMenuItem
                        title="Re-run Check"
                        titleCondensed="Re-run"
                        disabled={loading || !canRunCheck}
                        onClick={runCheck}
                      />
                    )}
                  </ReRunAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item
                  key="silence"
                  visible={event.isSilenced ? "never" : "if-room"}
                >
                  <SilenceAction
                    event={event}
                    onCreate={onCreateSilence}
                    onDone={refetch}
                  >
                    {menu => (
                      <SilenceMenuItem disabled={loading} onClick={menu.open} />
                    )}
                  </SilenceAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item
                  key="unsilence"
                  visible={event.isSilenced ? "if-room" : "never"}
                >
                  <ClearSilenceAction
                    record={event}
                    onDelete={onDeleteSilence}
                    onDone={refetch}
                  >
                    {menu => (
                      <UnsilenceMenuItem
                        onClick={menu.open}
                        disabled={loading || !menu.canOpen}
                      />
                    )}
                  </ClearSilenceAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item key="delete" visible="if-room">
                  <DeleteAction event={event} onDelete={onDelete}>
                    {handler => (
                      <DeleteMenuItem disabled={loading} onClick={handler.open} />
                    )}
                  </DeleteAction>
                </ToolbarMenu.Item>,
              ],
            })}
          </ToolbarMenu>
        }
      />
    );
  }
}

export default EventDetailsToolbar;
