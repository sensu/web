import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  PublishMenuItem,
  SilenceMenuItem,
  UnpublishMenuItem,
  UnsilenceMenuItem,
  QueueExecutionMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import Toolbar from "/lib/component/partial/Toolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

import ClearSilenceAction from "/lib/component/partial/ClearSilenceAction";
import ExecuteAction from "./CheckDetailsExecuteAction";
import ChangePublishStateAction from "./CheckDetailsChangePublishAction";
import SilenceAction from "./CheckDetailsSilenceAction";

class CheckDetailsToolbar extends React.Component {
  static propTypes = {
    check: PropTypes.object,
    loading: PropTypes.bool,
    refetch: PropTypes.func,
    toolbarItems: PropTypes.func,
    onCreateSilence: PropTypes.func.isRequired,
    onDeleteSilence: PropTypes.func.isRequired,
    onExecute: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
  };

  static defaultProps = {
    check: undefined,
    refetch: () => null,
    toolbarItems: ({ items }) => items,
  };

  static fragments = {
    check: gql`
      fragment CheckDetailsToolbar_check on CheckConfig {
        isSilenced

        ...CheckDetailsExecuteAction_check
        ...CheckDetailsSilenceAction_check
        ...ClearSilenceAction_record
      }

      ${ExecuteAction.fragments.check}
      ${SilenceAction.fragments.check}
      ${ClearSilenceAction.fragments.record}
    `,
  };

  render() {
    const {
      check: checkProp,
      loading,
      refetch,
      toolbarItems,
      onCreateSilence,
      onDeleteSilence,
      onExecute,
      onPublish,
    } = this.props;
    const check = checkProp || {};

    return (
      <Toolbar
        right={
          <ToolbarMenu>
            {toolbarItems({
              items: [
                <ToolbarMenu.Item key="execute " visible="always">
                  <ExecuteAction check={check} onExecute={onExecute}>
                    {handler => (
                      <QueueExecutionMenuItem
                        disable={loading}
                        onClick={handler}
                      />
                    )}
                  </ExecuteAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item
                  key="silence"
                  visible={check.isSilenced ? "never" : "if-room"}
                >
                  <SilenceAction
                    check={check}
                    onDone={refetch}
                    onCreate={onCreateSilence}
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
                  visible={check.isSilenced ? "if-room" : "never"}
                >
                  <ClearSilenceAction
                    record={check}
                    onDone={refetch}
                    onDelete={onDeleteSilence}
                  >
                    {dialog => (
                      <UnsilenceMenuItem
                        disabled={loading || !dialog.canOpen}
                        onClick={dialog.open}
                      />
                    )}
                  </ClearSilenceAction>
                </ToolbarMenu.Item>,
                <ToolbarMenu.Item
                  key={check.publish ? "unpublish" : "publish"}
                  visible="if-room"
                >
                  <ChangePublishStateAction
                    publish={!check.publish}
                    check={check}
                    onChange={onPublish}
                  >
                    {handler =>
                      check.publish ? (
                        <UnpublishMenuItem
                          disabled={loading}
                          onClick={handler}
                        />
                      ) : (
                        <PublishMenuItem disabled={loading} onClick={handler} />
                      )
                    }
                  </ChangePublishStateAction>
                </ToolbarMenu.Item>,
              ],
            })}
          </ToolbarMenu>
        }
      />
    );
  }
}

export default CheckDetailsToolbar;
