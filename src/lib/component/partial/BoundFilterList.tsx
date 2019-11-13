import React from "/vendor/react";
import { useFilterParams } from "/lib/component/util";
import { FilterList } from "/lib/component/base";
import { SearchParamKey } from "/lib/constant";

interface Props {
  paramKey?: SearchParamKey;
}

const BoundFilterList = ({ paramKey }: Props) => {
  const key = paramKey || SearchParamKey.filters;
  const [filters, setFilters] = useFilterParams(key);
  return <FilterList filters={filters} onChange={setFilters} />;
};

export default BoundFilterList;
