import React from "/vendor/react";

import { ResetMenuItem } from "/lib/component/partial/ToolbarMenuItems";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import ListToolbar from "/lib/component/partial/ListToolbar";

interface Props {
  onClickReset: () => void;
  toolbarContent: React.ReactNode;
  toolbarItems: (props: ToolbarItemsProps) => React.ReactNode;
}

export interface ToolbarItemsProps extends Props {
  items: [React.ReactNode];
}

export const EventFiltersToolbar = (props: Props) => {
  const { onClickReset, toolbarItems, toolbarContent } = props;
  return (
    <ListToolbar
      search={toolbarContent}
      toolbarItems={(props: Props) => (
        <ToolbarMenu>
          {toolbarItems({
            ...props,
            items: [
              <ToolbarMenu.Item key="reset">
                <ResetMenuItem onClick={onClickReset} />
              </ToolbarMenu.Item>,
            ],
          })}
        </ToolbarMenu>
      )}
    />
  );
};

EventFiltersToolbar.defaultProps = {
  toolbarContent: <React.Fragment />,
  toolbarItems: ({ items }: ToolbarItemsProps) => items,
};

export default EventFiltersToolbar;
