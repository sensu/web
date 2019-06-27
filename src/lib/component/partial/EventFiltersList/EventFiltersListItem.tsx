import React from "/vendor/react";
import { TableRow } from "/vendor/@material-ui/core";

import { createStyledComponent, NamespaceLink } from "/lib/component/util";
import ResourceDetails from "/lib/component/partial/ResourceDetails";
import TableOverflowCell from "/lib/component/partial/TableOverflowCell";

const AllowLabel = (createStyledComponent as any)({
  name: "EventFilterListItem.AllowLabel",
  component: "span",
  styles: (theme: any) => ({
    color: "white",
    fontSize: "0.7rem",
    fontWeight: "bold",
    backgroundColor: theme.palette.success,
    padding: theme.spacing.unit / 2,
  }),
});

const DenyLabel = (createStyledComponent as any)({
  name: "EventFilterListItem.DenyLabel",
  component: "span",
  styles: (theme: any) => ({
    color: "white",
    fontSize: "0.7rem",
    fontWeight: "bold",
    backgroundColor: theme.palette.critical,
    padding: theme.spacing.unit / 2,
  }),
});

const renderActionLabel = (action: string) => {
  switch (action) {
    case "ALLOW":
      return <AllowLabel>{action}</AllowLabel>;
    case "DENY":
      return <DenyLabel>{action}</DenyLabel>;
    default:
      return <strong>{action}</strong>;
  }
};

interface Props {
  eventFilter: {
    name: string;
    namespace: string;
    action: string;
  };
}

export const EventFilterListItem = ({ eventFilter }: Props) => {
  const { name, namespace, action } = eventFilter;

  return (
    <TableRow>
      <TableOverflowCell>
        <ResourceDetails
          title={
            <NamespaceLink namespace={namespace} to={`/filters/${name}`}>
              <strong>{name} </strong>
            </NamespaceLink>
          }
          details={
            <React.Fragment>
              {`Action: `}
              {renderActionLabel(action)}
            </React.Fragment>
          }
        />
      </TableOverflowCell>
    </TableRow>
  );
};

export default EventFilterListItem;
