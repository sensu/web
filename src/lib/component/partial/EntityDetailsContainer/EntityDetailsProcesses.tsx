/* eslint-disable react/display-name */

import React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "/vendor/@material-ui/core";

import DateTime from "/lib/component/base/DateFormatter/DateTime";

interface Process {
  pid: number;
  ppid: number;
  name: string;
  status: string;
  created: string;
  running: boolean;
  background: boolean;
  cpuPercent: number;
  memoryPercent: number;
}

interface Props {
  processes: Process[];
}

type Columns = "name" | "cpuPercent" | "memoryPercent" | "created" | "pid";

interface Column {
  id: Columns;
  primary?: boolean;
  label: string;
  minWidth?: number;
  align?: "center" | "right";
  format?: (value: any) => React.ReactElement | string;
}

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const columns: Column[] = [
  {
    id: "name",
    primary: true,
    label: "Process Name",
    minWidth: 185,
  },
  {
    id: "pid",
    label: "PID",
    format: (val: any) => Number(val).toString(),
  },
  {
    id: "created",
    label: "Created",
    format: (val: any) => <DateTime value={new Date(val)} short />,
  },
  {
    id: "cpuPercent",
    label: "% CPU",
    format: (val: any) => `${fmt.format(val)}%`,
  },
  {
    id: "memoryPercent",
    label: "% Mem",
    format: (val: any) => `${fmt.format(val)}%`,
  },
];

const sortString = (a: string, b: string) => {
  if (a === b) {
    return 0;
  }
  return a > b ? 1 : -1;
};

const EntityDetailsProcesses = ({ processes: processesProp }: Props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [orderBy, setOrderBy] = React.useState<Columns>("cpuPercent");
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const createOrderHandler = (col: Columns) => () => {
    if (orderBy === col) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setOrderBy(col);
      setOrder("desc");
      setPage(0);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const processes = Object.assign([] as Process[], processesProp)
    .sort((a, b) => sortString(a.name, b.name))
    .sort((a, b) => {
      // TODO(james): can we use a generic?
      let val: number;
      if (typeof a[orderBy] === "string") {
        val = sortString(a[orderBy] as string, b[orderBy] as string);
      } else {
        val = (a[orderBy] as number) - (b[orderBy] as number);
      }
      if (order === "asc") {
        val *= -1;
      }
      return val;
    });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Process Explorer</Typography>
      </CardContent>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={createOrderHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row.pid}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          component={column.primary ? "th" : "td"}
                          scope="row"
                        >
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={processes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Card>
  );
};

EntityDetailsProcesses.fragments = {
  process: gql`
    fragment EntityDetailsProcesses_process on Process {
      pid
      ppid
      name
      status
      created
      running
      background
      cpuPercent
      memoryPercent
    }
  `,
};

export default EntityDetailsProcesses;
