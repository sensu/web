import React from "react";
import withTheme from "/app/storybook/withTheme";

import Pagination from "./Pagination";

export default {
  title: "partial / Pagination",
  component: Pagination,
  decorators: [withTheme],
};

export const withControls = (args) => (
  <Pagination {...args} onChangeQuery={() => null} />
);
withControls.args = {
  pageInfo: {
    totalCount: 200,
  },
  offset: 0,
  limit: 25,
};
