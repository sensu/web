import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  SelectMenuItem,
  PublishMenuItem,
  SilenceMenuItem,
  UnpublishMenuItem,
  UnsilenceMenuItem,
  QueueExecutionMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import ListHeader from "/lib/component/partial/ListHeader";
import ListSortSelector from "/lib/component/partial/ListSortSelector";
import { ToolbarSelectOption } from "/lib/component/partial/ToolbarSelect";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

import { toggleParam } from "/lib/util/filterParams";

class ChecksListHeader extends React.PureComponent {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    filters: PropTypes.object.isRequired,
    namespace: PropTypes.object,
    onChangeFilters: PropTypes.func.isRequired,
    onClickClearSilences: PropTypes.func.isRequired,
    onClickExecute: PropTypes.func.isRequired,
    onClickSetPublish: PropTypes.func.isRequired,
    onClickSilence: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    selectedItems: PropTypes.array.isRequired,
    toggleSelectedItems: PropTypes.func.isRequired,
  };

  static defaultProps = {
    namespace: null,
  };

  static fragments = {
    namespace: gql`
      fragment ChecksListHeader_namespace on Namespace {
        subscriptions(orderBy: OCCURRENCES, omitEntity: true) {
          values(limit: 25)
        }
      }
    `,
    check: gql`
      fragment ChecksListHeader_check on CheckConfig {
        id
        publish
        silences {
          id
        }
      }
    `,
  };

  renderActions = () => {
    const { filters, namespace, onChangeFilters, order } = this.props;

    const subscriptions = namespace ? namespace.subscriptions.values : [];
    return (
      <ToolbarMenu>
        <ToolbarMenu.Item key="filter-by-published" visible="if-room">
          <SelectMenuItem
            title="Published"
            onChange={toggleParam("published", onChangeFilters)}
          >
            {[["true", "Published"], ["false", "Unpublished"]].map(
              ([v, label]) => (
                <ToolbarSelectOption
                  key={v}
                  value={v}
                  selected={filters.published === v}
                >
                  {label}
                </ToolbarSelectOption>
              ),
            )}
          </SelectMenuItem>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="filter-by-subscription" visible="if-room">
          <SelectMenuItem
            title="Subscription"
            onChange={toggleParam("subscription", onChangeFilters)}
          >
            {subscriptions.map(val => (
              <ToolbarSelectOption
                key={val}
                value={val}
                selected={val === filters.subscription}
              />
            ))}
          </SelectMenuItem>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="sort" visible="if-room">
          <ListSortSelector
            options={[{ label: "Name", value: "NAME" }]}
            value={order}
          />
        </ToolbarMenu.Item>
      </ToolbarMenu>
    );
  };

  renderBulkActions = () => {
    const { selectedItems } = this.props;

    const selectedCount = selectedItems.length;
    const selectedSilenced = selectedItems.filter(en => en.silences.length > 0);
    const selectedPublished = selectedItems.filter(ch => ch.publish === true);
    const selectedNonKeepalives = selectedItems.filter(
      ch => ch.name !== "keepalive",
    );

    const allSelectedSilenced = selectedSilenced.length === selectedCount;
    const allSelectedUnsilenced = selectedSilenced.length === 0;
    const published = selectedCount === selectedPublished.length;

    return (
      <ToolbarMenu>
        <ToolbarMenu.Item key="queue" visible="always">
          <QueueExecutionMenuItem
            disabled={selectedNonKeepalives.length === 0}
            onClick={this.props.onClickExecute}
            description="Queue an adhoc execution of the selected checks."
          />
        </ToolbarMenu.Item>
        <ToolbarMenu.Item
          key="silence"
          visible={allSelectedSilenced ? "never" : "if-room"}
        >
          <SilenceMenuItem
            disabled={allSelectedSilenced}
            onClick={this.props.onClickSilence}
          />
        </ToolbarMenu.Item>
        <ToolbarMenu.Item
          key="unsilence"
          visible={allSelectedUnsilenced ? "never" : "if-room"}
        >
          <UnsilenceMenuItem
            disabled={allSelectedUnsilenced}
            onClick={this.props.onClickClearSilences}
          />
        </ToolbarMenu.Item>
        {!published ? (
          <ToolbarMenu.Item key="publish" visible="if-room">
            <PublishMenuItem
              description="Publish selected checks."
              onClick={() => this.props.onClickSetPublish(true)}
            />
          </ToolbarMenu.Item>
        ) : (
          <ToolbarMenu.Item key="unpublish" visible="if-room">
            <UnpublishMenuItem
              description="Unpublish selected checks."
              onClick={() => this.props.onClickSetPublish(false)}
            />
          </ToolbarMenu.Item>
        )}
      </ToolbarMenu>
    );
  };

  render() {
    const {
      editable,
      selectedItems,
      toggleSelectedItems,
      rowCount,
    } = this.props;

    return (
      <ListHeader
        sticky
        editable={editable}
        selectedCount={selectedItems.length}
        rowCount={rowCount}
        onClickSelect={toggleSelectedItems}
        renderActions={this.renderActions}
        renderBulkActions={this.renderBulkActions}
      />
    );
  }
}

export default ChecksListHeader;
