import React from "/vendor/react";
import { ConfirmAction } from "/lib/component/util";
import Dialog from "./Dialog";

interface ChildProps {
  open: () => void;
  close: () => void;
}

interface Props {
  children: (_: ChildProps) => React.ReactElement;
  identifier: React.ReactElement | string;
  onSubmit: (_: any) => void;
}

const ConfirmDelete = ({ children, onSubmit, ...props }: Props) => (
  <ConfirmAction>
    {({ isOpen, open, close }) => (
      <React.Fragment>
        <Dialog
          {...props}
          open={isOpen}
          onClose={close}
          onConfirm={(ev) => {
            onSubmit(ev);
            close();
          }}
        />
        {children({ open, close })}
      </React.Fragment>
    )}
  </ConfirmAction>
);

export default ConfirmDelete;
