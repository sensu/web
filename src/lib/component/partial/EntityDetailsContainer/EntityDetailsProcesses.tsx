/* eslint-disable react/display-name */

import React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
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

interface Column {
  id: "name" | "cpuPercent" | "memoryPercent" | "created" | "pid";
  primary?: boolean;
  label: string;
  minWidth?: number;
  align?: "center" | "right";
  format?: (value: any) => React.ReactElement | string;
}

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });
const columns: Column[] = [
  {
    id: "name",
    primary: true,
    label: "Process Name",
    minWidth: 185,
    format: (val: any) => val.slice(0, 1).toUpperCase() + val.slice(1),
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
    format: (val: any) => `${fmt.format(val / 100)}%`,
  },
  {
    id: "memoryPercent",
    label: "% Mem",
    format: (val: any) => `${fmt.format(val / 100)}%`,
  },
];

const EntityDetailsProcesses = ({ processes: processesProp }: Props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const processes = Object.assign([] as Process[], processesProp).sort(
    (a, b) => a.pid - b.pid,
  );

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
                >
                  {column.label}
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
        rowsPerPageOptions={[10, 25, 100]}
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
