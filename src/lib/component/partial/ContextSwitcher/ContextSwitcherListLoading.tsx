import React from "/vendor/react";
import { List, ListSubheader } from "/vendor/@material-ui/core";
import { Skeleton } from "/lib/component/base";
import ContextSwitcherListItem from "./ContextSwitcherListItem";

interface Props {
  dense: boolean;
}

const ContextSwitcherListLoading = ({ dense }: Props) => {
  return (
    <React.Fragment>
      <List
        subheader={
          <ListSubheader>
            <Skeleton variant="text">my-local-cluster</Skeleton>
          </ListSubheader>
        }
      >
        <ContextSwitcherListItem
          icon={<Skeleton variant="icon" />}
          primary={<Skeleton variant="text">namesace-xxx-yyy</Skeleton>}
          decoration={<Skeleton variant="icon" />}
          dense={dense}
        />
        <ContextSwitcherListItem
          icon={<Skeleton variant="icon" />}
          primary={<Skeleton variant="text">namesace-z</Skeleton>}
          decoration={<Skeleton variant="icon" />}
          dense={dense}
        />
        <ContextSwitcherListItem
          icon={<Skeleton variant="icon" />}
          primary={<Skeleton variant="text">namesace-xyz-0</Skeleton>}
          decoration={<Skeleton variant="icon" />}
          dense={dense}
        />
      </List>
      <List
        subheader={
          <ListSubheader>
            <Skeleton variant="text">some-other-cluster</Skeleton>
          </ListSubheader>
        }
      >
        <ContextSwitcherListItem
          icon={<Skeleton variant="icon" />}
          primary={<Skeleton variant="text">namesace-xxx-yyy</Skeleton>}
          decoration={<Skeleton variant="icon" />}
          dense={dense}
        />
      </List>
      <List
        subheader={
          <ListSubheader>
            <Skeleton variant="text">third-cluster</Skeleton>
          </ListSubheader>
        }
      >
        <ContextSwitcherListItem
          icon={<Skeleton variant="icon" />}
          primary={<Skeleton variant="text">namesace-z</Skeleton>}
          decoration={<Skeleton variant="icon" />}
          dense={dense}
        />
        <ContextSwitcherListItem
          icon={<Skeleton variant="icon" />}
          primary={<Skeleton variant="text">namesace-xyz-0</Skeleton>}
          decoration={<Skeleton variant="icon" />}
          dense={dense}
        />
      </List>
    </React.Fragment>
  );
};

export default ContextSwitcherListLoading;
