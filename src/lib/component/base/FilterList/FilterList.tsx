import React from "/vendor/react";
import PropTypes from "prop-types";

import { FilterParamMap } from "/lib/util/filterParams";

import { createStyledComponent } from "/lib/component/util";
import { Chip as MUIChip } from "/vendor/@material-ui/core";

// TODO: Remove `any` types once `createStyledComponent` is fully annotated
const Chip = (createStyledComponent as any)({
  name: "FilterList.Chip",
  component: MUIChip,
  styles: (theme: any) => {
    const margin = theme.spacing(0.5);
    return {
      marginRight: margin,
      marginBottom: margin,
    };
  },
});

const Key = createStyledComponent({
  name: "FilterList.Key",
  component: "span",
  styles: () => ({ marginRight: "0.125rem" }),
});

const Em = createStyledComponent({
  name: "FilterList.Em",
  component: "span",
  styles: () => ({ fontStyle: "italic" }),
});

interface Props {
  filters: FilterParamMap;
  onChange(action: (prevFilters: FilterParamMap) => FilterParamMap): void;
}

const FilterList = ({ filters, onChange }: Props) => {
  const chips = Object.keys(filters)
    .sort()
    .map((key) => (
      <Chip
        key={key}
        onDelete={
          onChange
            ? () => onChange((filters) => ({ ...filters, [key]: undefined }))
            : undefined
        }
        label={
          <React.Fragment>
            <Key>{key}</Key>
            <Em>{filters[key]}</Em>
          </React.Fragment>
        }
      />
    ));

  return <div>{chips}</div>;
};

FilterList.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

FilterList.defaultProps = {
  onChange: undefined,
};

export default FilterList;
