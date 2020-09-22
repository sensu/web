import React from "react";
import gql from "graphql-tag";
import TablePagination from "@material-ui/core/TablePagination";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "sticky",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    borderTopColor: theme.palette.divider,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    marginTop: -1,
  },
}));

interface Props {
  pageInfo?: {
    totalCount: number;
  };
  limit?: number | string;
  offset?: number | string;
  onChangeQuery: (_: any) => void;
}

const parseNum = (n?: number | string) => {
  const out = parseInt((n || 0) as string, 10);
  if (Number.isNaN(out)) {
    throw new TypeError(`expected numeric; received ${n}`);
  }
  return out;
};

const Pagination = ({ onChangeQuery, ...props }: Props) => {
  const classes = useStyles();

  const limit = parseNum(props.limit);
  const offset = parseNum(props.offset);

  // Fall back to a placeholder total count value (equal to page size) while
  // pageInfo is undefined during load.
  const count = props.pageInfo?.totalCount || limit;

  // Given that offset isn't strictly a multiple of limit, the current page
  // index must be rounded down. In the case that we have a small offset that
  // would otherwise round to zero, return 1 to enable the previous page
  // button to reset offset to 0.
  const page = offset > 0 && offset < limit ? 1 : Math.floor(offset / limit);

  const handleChangePage = React.useCallback(
    (_: any, page: number) => onChangeQuery({ offset: page * limit }),
    [onChangeQuery, limit],
  );

  const handleChangeLimit = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      onChangeQuery({ limit: event.target.value, offset: 0 }),
    [onChangeQuery],
  );

  return (
    <TablePagination
      component="div"
      className={classes.root}
      count={count}
      rowsPerPage={limit}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeLimit}
      rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
    />
  );
};

Pagination.fragments = {
  pageInfo: gql`
    fragment Pagination_pageInfo on OffsetPageInfo {
      totalCount
    }
  `,
};

export default Pagination;
