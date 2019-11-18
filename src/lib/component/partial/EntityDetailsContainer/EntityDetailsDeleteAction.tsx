import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { useRouter } from "/lib/component/util";
import ConfirmDelete from "/lib/component/partial/ConfirmDelete";

interface Props {
  children: (_: any) => JSX.Element;
  entity?: {
    id?: string;
    name?: string;
  };
  onDelete: (_: any) => Promise<any>;
}

const EntityDetailsDeleteAction = ({
  children,
  entity = {},
  onDelete,
}: Props) => {
  const { id, name } = entity;
  const { history } = useRouter();

  const deleteRecord = React.useCallback(() => {
    // delete
    onDelete({ id });

    // optimistically redirect
    history.push(history.location.pathname.replace(/\/[^/.]+$/, ""));
  }, [id, history, onDelete]);

  return (
    <ConfirmDelete identifier={name} onSubmit={deleteRecord}>
      {children}
    </ConfirmDelete>
  );
};

EntityDetailsDeleteAction.fragments = {
  entity: gql`
    fragment EntityDetailsDeleteAction_entity on Entity {
      id
      name
    }
  `,
};

export default EntityDetailsDeleteAction;
