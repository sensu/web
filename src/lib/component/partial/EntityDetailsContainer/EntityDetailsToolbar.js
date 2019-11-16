import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  DeleteMenuItem,
  SilenceMenuItem,
  UnsilenceMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import ClearSilenceAction from "/lib/component/partial/ClearSilenceAction";
import DeleteAction from "./EntityDetailsDeleteAction";
import SilenceAction from "./EntityDetailsSilenceAction";

import Toolbar from "/lib/component/partial/Toolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

class EntityDetailsToolbar extends React.Component {
  static propTypes = {
    entity: PropTypes.object,
    loading: PropTypes.bool,
    refetch: PropTypes.func.isRequired,
    toolbarItems: PropTypes.func,
    onCreateSilence: PropTypes.func.isRequired,
    onDeleteSilence: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entity: {},
    loading: false,
    toolbarItems: ({ items }) => items,
  };

  static fragments = {
    entity: gql`
      fragment EntityDetailsToolbar_entity on Entity {
        isSilenced

        ...EntityDetailsDeleteAction_entity
        ...EntityDetailsSilenceAction_entity
        ...ClearSilenceAction_record
      }

      ${ClearSilenceAction.fragments.record}
      ${DeleteAction.fragments.entity}
      ${SilenceAction.fragments.entity}
    `,
  };

  render() {
    const {
      entity,
      loading,
      refetch,
      toolbarItems,
      onCreateSilence,
      onDeleteSilence,
      onDelete,
    } = this.props;

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
                  <SilenceAction
                    entity={entity}
                    onCreate={onCreateSilence}
                    onDone={refetch}
                  >
                    {dialog => (
                      <SilenceMenuItem
                        disabled={loading || dialog.canOpen}
                        onClick={dialog.open}
                      />
                    )}
                  </SilenceAction>
                </ToolbarMenu.Item>,

                <ToolbarMenu.Item
                  key="unsilence"
                  visible={entity.isSilenced ? "if-room" : "never"}
                >
                  <ClearSilenceAction
                    record={entity}
                    onDelete={onDeleteSilence}
                    onDone={refetch}
                  >
                    {dialog => (
                      <UnsilenceMenuItem
                        disabled={loading || !dialog.canOpen}
                        onClick={dialog.open}
                      />
                    )}
                  </ClearSilenceAction>
                </ToolbarMenu.Item>,

                <ToolbarMenu.Item key="delete" visible="if-room">
                  <DeleteAction entity={entity} onDelete={onDelete}>
                    {handler => (
                      <DeleteMenuItem
                        disabled={loading}
                        onClick={handler.open}
                      />
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

export default EntityDetailsToolbar;
