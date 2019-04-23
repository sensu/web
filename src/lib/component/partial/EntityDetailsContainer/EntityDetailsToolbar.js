import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  SilenceMenuItem,
  UnsilenceMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import ClearSilenceAction from "/lib/component/partial/ClearSilenceAction";
import SilenceAction from "./EntityDetailsSilenceAction";
import Toolbar from "/lib/component/partial/Toolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

class EntityDetailsToolbar extends React.Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
    toolbarItems: ({ items }) => items,
  };

  static fragments = {
    entity: gql`
      fragment EntityDetailsToolbar_entity on Entity {
        isSilenced

        ...EntityDetailsSilenceAction_entity
        ...ClearSilenceAction_record
      }

      ${SilenceAction.fragments.entity}
      ${ClearSilenceAction.fragments.record}
    `,
  };

  render() {
    const { entity, refetch, toolbarItems } = this.props;

    return (
      <Toolbar
        right={
          <ToolbarMenu>
            {toolbarItems({
              items: [
                <ToolbarMenu.Item
                  key="silence"
                  visible={entity.isSilenced ? "never" : "if-room"}
                >
                  <SilenceAction entity={entity} onDone={refetch}>
                    {dialog => (
                      <SilenceMenuItem
                        disabled={dialog.canOpen}
                        onClick={dialog.open}
                      />
                    )}
                  </SilenceAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item
                  key="unsilence"
                  visible={entity.isSilenced ? "if-room" : "never"}
                >
                  <ClearSilenceAction record={entity} onDone={refetch}>
                    {dialog => (
                      <UnsilenceMenuItem
                        disabled={!dialog.canOpen}
                        onClick={dialog.open}
                      />
                    )}
                  </ClearSilenceAction>
                </ToolbarMenu.Item>,
              ],
            })}
          </ToolbarMenu>
        }
      />
    );
  }
}

export default EntityDetailsToolbar;
