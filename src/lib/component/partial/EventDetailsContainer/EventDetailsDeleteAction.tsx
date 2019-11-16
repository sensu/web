import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { useRouter } from "/lib/component/util";
import ConfirmDelete from "/lib/component/partial/ConfirmDelete";

interface Props {
  event: {
    id?: string;
  };
  onDelete: (_: any) => Promise<any>;
  children: (_: any) => JSX.Element;
}

const EventDetailsDeleteAction = ({
  event = {},
  onDelete,
  children,
}: Props) => {
  const { id } = event;
  const { history } = useRouter();

  const deleteEvent = React.useCallback(() => {
    // Send request
    onDelete({ id });

    // Optimistically redirect
    history.replace(history.location.pathname.replace(/\/[^/.]+$/, ""));
  }, [id, history, onDelete]);

  return (
    <ConfirmDelete identifier="this event" onSubmit={deleteEvent}>
      {children}
    </ConfirmDelete>
  );
};

EventDetailsDeleteAction.fragments = {
  event: gql`
    fragment EventDetailsDeleteAction_event on Event {
      id
    }
  `,
};

export default EventDetailsDeleteAction;
