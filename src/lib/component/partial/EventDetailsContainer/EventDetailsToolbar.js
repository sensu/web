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

import ClearSilenceAction from "/lib/component/partial/ClearSilenceAction";
import Toolbar from "/lib/component/partial/Toolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

import DeleteAction from "./EventDetailsDeleteAction";
import ResolveAction from "./EventDetailsResolveAction";
import ReRunAction from "./EventDetailsReRunAction";
import SilenceAction from "./EventDetailsSilenceAction";

class EventDetailsToolbar extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    refetch: PropTypes.func,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
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
    const { event, refetch, toolbarItems } = this.props;

    return (
      <Toolbar
        right={
          <ToolbarMenu fillWidth>
            {toolbarItems({
              items: [
                <ToolbarMenu.Item key="resolve" visible="always">
                  <ResolveAction event={event}>
                    {({ resolve, canResolve }) => (
                      <ResolveMenuItem
                        disabled={!canResolve}
                        onClick={resolve}
                      />
                    )}
                  </ResolveAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item key="re-run" visible="if-room">
                  {event.check.name !== "keepalive" && (
                    <ReRunAction event={event}>
                      {run => (
                        <QueueExecutionMenuItem
                          title="Re-run Check"
                          titleCondensed="Re-run"
                          onClick={run}
                        />
                      )}
                    </ReRunAction>
                  )}
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item
                  key="silence"
                  visible={event.isSilenced ? "never" : "if-room"}
                >
                  <SilenceAction event={event} onDone={refetch}>
                    {menu => <SilenceMenuItem onClick={menu.open} />}
                  </SilenceAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item
                  key="unsilence"
                  visible={event.isSilenced ? "if-room" : "never"}
                >
                  <ClearSilenceAction record={event} onDone={refetch}>
                    {menu => (
                      <UnsilenceMenuItem
                        onClick={menu.open}
                        disabled={!menu.canOpen}
                      />
                    )}
                  </ClearSilenceAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item key="delete" visible="if-room">
                  <DeleteAction event={event}>
                    {handler => <DeleteMenuItem onClick={handler} />}
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
