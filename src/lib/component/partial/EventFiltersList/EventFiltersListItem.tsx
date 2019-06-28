import React from "/vendor/react";
import { TableRow } from "/vendor/@material-ui/core";

import { NamespaceLink } from "/lib/component/util";
import EventFilterActionLabel from "/lib/component/partial/EventFilterActionLabel";
import ResourceDetails from "/lib/component/partial/ResourceDetails";
import TableOverflowCell from "/lib/component/partial/TableOverflowCell";

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
              <EventFilterActionLabel action={action} />
            </React.Fragment>
          }
        />
      </TableOverflowCell>
    </TableRow>
  );
};

export default EventFilterListItem;
