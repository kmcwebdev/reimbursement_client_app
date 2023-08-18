import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import Head from "next/head";
import React, { useState } from "react";
import { Button } from "~/components/core/Button";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table, { type Reimbursement } from "~/components/core/Table";
import TableCheckbox from "~/components/core/Table/TableCheckbox";
import ClientFilter from "~/components/core/Table/filters/ClientFilter";
import ReimbursementTypeFilter from "~/components/core/Table/filters/ReimbursementTypeFilter";
import {
  default as StatusFilter,
  default as StatusTypeFilter,
} from "~/components/core/Table/filters/StatusFilter";
import { sampleData } from "~/utils/sampleData";

// const DashboardComponent = dynamic(() => import("~/components/dashboard"));

const Dashboard: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<Reimbursement>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <TableCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <div className="px-4">
            <TableCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue() as StatusType} />,
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: StatusFilter,
        },
      },
      {
        accessorKey: "client",
        cell: (info) => info.getValue(),
        header: "Client",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: ClientFilter,
        },
      },
      {
        accessorKey: "id",
        cell: (info) => info.getValue(),
        header: "ID",
      },
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: "Name",
      },
      {
        accessorKey: "reimbursementId",
        cell: (info) => info.getValue(),
        header: "R-ID",
      },
      {
        accessorKey: "type",
        cell: (info) => info.getValue(),
        header: "Type",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: ReimbursementTypeFilter,
        },
      },
      {
        accessorKey: "expense",
        cell: (info) => info.getValue(),
        header: "Expense",
      },
      {
        accessorKey: "filed",
        cell: (info) => info.getValue(),
        header: "Filed",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: StatusTypeFilter,
        },
      },
      {
        accessorKey: "total",
        cell: (info) => info.getValue(),
        header: "Total",
      },
      {
        accessorKey: "reimbursementId",
        cell: (info) => (
          <Button buttonType="text" onClick={() => alert(info.getValue())}>
            View
          </Button>
        ),
        header: "Total",
      },
    ],
    [],
  );
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Table
        data={sampleData}
        columns={columns}
        tableState={{ pagination, selectedItems, columnFilters }}
        tableStateActions={{
          setColumnFilters,
          setSelectedItems,
          setPagination,
        }}
      />
    </>
  );
};

export default Dashboard;
