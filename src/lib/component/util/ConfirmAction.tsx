import React from "/vendor/react";

interface ChildProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

interface Props {
  children: (_: ChildProps) => React.ReactElement;
}

const ConfirmAction = ({ children }: Props) => {
  const [isOpen, setOpen] = React.useState(false);
  const childArgs = React.useMemo(
    () => ({
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [isOpen, setOpen],
  );

  return children(childArgs);
};

export default ConfirmAction;
