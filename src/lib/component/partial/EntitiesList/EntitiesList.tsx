import React, { ReactNode, useCallback, useMemo, useState } from "/vendor/react";
import { ApolloClient } from "/vendor/apollo-client";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { useApolloClient, useSearchParams, useFilterParams } from "/lib/component/util";
import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "/vendor/@material-ui/core";
import { Skeleton, TableListEmptyState, Loader } from "/lib/component/base";
import { ListController, ListControllerRenderItemProps } from "/lib/component/controller";
import deleteEntity from "/lib/mutation/deleteEntity";
import Pagination from "/lib/component/partial/Pagination";
import SilenceEntryDialog from "/lib/component/partial/SilenceEntryDialog";
import ClearSilencedEntriesDialog from "/lib/component/partial/ClearSilencedEntriesDialog";
import EntitiesListHeader from "./EntitiesListHeader";
import EntitiesListItem from "./EntitiesListItem";

export interface EntitiesListVariables {
  limit: number;
  offset: number;
  order: string;
  filters: string[];
}

interface Entity {
  id: string;
  name: string;
  check: string;
  namespace: string;
  silences: string[];
  deleted: boolean;
}

interface State {
  silence: object|null;
  unsilence: object|null;
}

interface EntitiesListItemContainerProps extends ListControllerRenderItemProps<Entity> {
  editable: boolean;
  setModalState: React.Dispatch<React.SetStateAction<State>>;
}

const createDelete = (client: ApolloClient<any>, records: Entity[]) => () =>
  records.forEach(record => deleteEntity(client, { id:  record.id }));

const createSilence = (setter: React.Dispatch<React.SetStateAction<State>>, records: Entity[]) => () => {
  const targets = records
    .filter(record => record.silences.length === 0)
    .map(record => ({
      namespace: record.namespace,
      check: "*",
      subscription: `entity:${record.name}`,
    }));

  if (targets.length === 1) {
    setter(state => ({
      ...state,
      silence: {
        props: {},
        ...targets[0],
      },
    }));
  } else if (targets.length) {
    setter(state => ({
      ...state,
      silence: { props: {}, targets },
    }));
  }
};

const createUnsilence = (setter: React.Dispatch<React.SetStateAction<State>>, records: Entity[]) => () => {
  const unsilence = records.reduce<string[]>((memo, item) => [...memo, ...item.silences], []);

  setter(state => ({
    ...state,
    unsilence,
  }));
};

const EntitiesListItemContainer = ({
    key,
    editable,
    item,
    hovered,
    setHovered,
    selectedCount,
    selected,
    setSelected,
    setModalState,
}: EntitiesListItemContainerProps) => {
  const client = useApolloClient();

  const onDelete = useCallback(createDelete(client, [item]), [client, item]);
  const onSilence = useCallback(createSilence(setModalState, [item]), [setModalState, item]);
  const onUnsilence = useCallback(createUnsilence(setModalState, [item]), [setModalState, item]);

  return (
    <EntitiesListItem
      key={key}
      editable={editable}
      editing={selectedCount > 0}
      entity={item}
      hovered={hovered}
      onHover={editable ? setHovered : () => null}
      selected={selected}
      onChangeSelected={setSelected}
      onClickDelete={onDelete}
      onClickSilence={onSilence}
      onClickClearSilence={onUnsilence}
    />
  );
}

const EntitiesListContent = ({
  children,
  selectedItems,
  setSelectedItems,
  toggleSelectedItems,
  editable,
  loading,
  namespace
  order,
  refetch,
  limit,
  offset,
  setModalState,
}) => {
  const client = useApolloClient();
  const [, setParams] = useSearchParams();
  const [filters, setFilters] = useFilterParams();

  const onDelete = useCallback(createDelete(client, selectedItems), [client,selectedItems]);
  const onSilence = useCallback(createSilence(setModalState, [selectedItems]), [setModalState, selectedItems]);
  const onUnsilence = useCallback(createUnsilence(setModalState, [selectedItems]), [setModalState, selectedItems]);

    return (
      <Paper>
        <Loader loading={loading}>
          <EntitiesListHeader
            editable={editable}
            filters={filters}
            selectedItems={selectedItems}
            rowCount={(children as ReactNode[]).length || 0}
            onClickSelect={toggleSelectedItems}
            onClickDelete={onDelete}
            onClickSilence={onSilence}
            onClickClearSilences={onUnsilence}
            onChangeFilters={setFilters}
            onChangeQuery={setParams}
            namespace={namespace}
            order={order}
          />

          <Table>
            <TableBody>{children}</TableBody>
          </Table>

          <Pagination
            limit={limit}
            offset={offset}
            pageInfo={namespace && namespace.entities.pageInfo}
            onChangeQuery={onChangeQuery}
          />

          <ClearSilencedEntriesDialog
            silences={unsilence}
            open={!!unsilence}
            close={() => {
              this.setState({ unsilence: null });
              setSelectedItems([]);
              refetch();
            }}
          />

          {silence && (
            <SilenceEntryDialog
              values={silence}
              onClose={() => {
                this.setState({ silence: null });
                setSelectedItems([]);
                refetch();
              }}
            />
          )}
        </Loader>
      </Paper>
    );
};

const EntitiesList = ({
  editable,
  loading,
  limit,
  namespace,
  offset,
  order,
  refetch,
}) => {
  const client = useApolloClient();
  const [modalState, setModalState] = useState<State>({ silence: null, unsilence: null });

  const renderEmptyState = useCallback(() => {
    if (loading) {
      return (
        <React.Fragment>
          <TableRow>
            <TableCell><Skeleton variant="text">abcd</Skeleton></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Skeleton variant="text">efghij</Skeleton></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Skeleton variant="text">klmno</Skeleton></TableCell>
          </TableRow>
        </React.Fragment>
      );
    }
    return (
      <TableRow>
        <TableCell>
          <TableListEmptyState
            primary="No results matched your query."
            secondary="
          Try refining your search query in the search box. The filter buttons
          above are also a helpful way of quickly finding entities.
        "
          />
        </TableCell>
      </TableRow>
  )}, [loading]);

  const identity = useCallback((r: Entity) => r.id, []);
  const renderItem = useCallback((props: ListControllerRenderItemProps<Entity>) => (
    <EntitiesListItemContainer
      {...props}
      editable={editable}
      setModalState={setModalState}
    />
  ), [editable, setModalState]);

  const items: Entity[] = useMemo(() => {
    if (!namespace) {
      return [];
    }
    return namespace.entities.nodes.filter((r: Entity) => !r.deleted);
  }, [namespace]);

  return (
    <ListController
      items={items}
      getItemKey={identity}
      renderEmptyState={renderEmptyState}
      renderItem={renderItem}
    >
      {({
        children,
        selectedItems,
        setSelectedItems,
        toggleSelectedItems,
      }) => (
        <Paper>
          <Loader loading={loading}>
            <EntitiesListHeader
              editable={editable}
              filters={filters}
              selectedItems={selectedItems}
              rowCount={(children as ReactNode[]).length || 0}
              onClickSelect={toggleSelectedItems}
              onClickDelete={deleteEntities(selectedItems)}
              onClickSilence={silenceItems(selectedItems)}
              onClickClearSilences={clearSilences(selectedItems)}
              onChangeFilters={onChangeFilters}
              onChangeQuery={onChangeQuery}
              namespace={namespace}
              order={order}
            />

            <Table>
              <TableBody>{children}</TableBody>
            </Table>

            <Pagination
              limit={limit}
              offset={offset}
              pageInfo={namespace && namespace.entities.pageInfo}
              onChangeQuery={onChangeQuery}
            />

            <ClearSilencedEntriesDialog
              silences={unsilence}
              open={!!unsilence}
              close={() => {
                this.setState({ unsilence: null });
                setSelectedItems([]);
                refetch();
              }}
            />

            {silence && (
              <SilenceEntryDialog
                values={silence}
                onClose={() => {
                  this.setState({ silence: null });
                  setSelectedItems([]);
                  refetch();
                }}
              />
            )}
          </Loader>
        </Paper>
      )}
    </ListController>
  );
}

  EntitiesList.propTypes = {
    editable: PropTypes.bool,
    loading: PropTypes.bool,
    namespace: PropTypes.object,
    order: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    onChangeFilters: PropTypes.func.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    refetch: PropTypes.func,
  };

  EntitiesList.defaultProps = {
    editable: false,
    loading: false,
    limit: undefined,
    namespace: null,
    offset: undefined,
    refetch: () => null,
  };

  EntitiesList.fragments = {
    namespace: gql`
      fragment EntitiesList_namespace on Namespace {
        entities(
          limit: $limit
          offset: $offset
          filters: $filters
          orderBy: $order
        ) @connection(key: "entities", filter: ["filters", "orderBy"]) {
          nodes {
            id
            namespace
            deleted @client

            silences {
              ...ClearSilencedEntriesDialog_silence
            }

            ...EntitiesListItem_entity
          }

          pageInfo {
            ...Pagination_pageInfo
          }
        }
        ...EntitiesListHeader_namespace
      }

      ${ClearSilencedEntriesDialog.fragments.silence}
      ${EntitiesListHeader.fragments.namespace}
      ${EntitiesListItem.fragments.entity}
      ${Pagination.fragments.pageInfo}
    `,
  };

export default EntitiesList;
