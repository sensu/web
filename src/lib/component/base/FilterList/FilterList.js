import React from "/vendor/react";
import PropTypes from "prop-types";

import { createStyledComponent } from "/lib/component/util";
import { Chip as MUIChip } from "/vendor/@material-ui/core";
import { toggleParam } from "/lib/util/filterParams";

const Chip = createStyledComponent({
  name: "FilterList.Chip",
  component: MUIChip,
  styles: theme => {
    const margin = theme.spacing.unit / 2;
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

const FilterList = ({ filters, onChange }) => {
  let onClickDelete;
  if (onChange) {
    onClickDelete = key => toggleParam(key, onChange)(null);
  }

  const chips = Object.keys(filters)
    .sort()
    .map(key => (
      <Chip
        key={key}
        onDelete={() => onClickDelete(key)}
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
