/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import Head from "next/head";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import PageAnimation from "~/components/animation/PageAnimation";
import { Button } from "~/components/core/Button";
import Table, { type Reimbursement } from "~/components/core/Table";
import Input from "~/components/core/form/fields/Input";
import { sampleData } from "~/utils/sampleData";

import dynamic from "next/dynamic";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import TableCheckbox from "~/components/core/Table/TableCheckbox";
import ClientFilter from "~/components/core/Table/filters/ClientFilter";
import ReimbursementTypeFilter from "~/components/core/Table/filters/ReimbursementTypeFilter";

const StatusFilter = dynamic(
  () => import("~/components/core/Table/filters/StatusFilter"),
);

const Reimbursements: React.FC = () => {
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
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: StatusFilter,
        },
      },
      {
        accessorKey: "filed",
        cell: (info) => info.getValue(),
        header: "filed",
      },
      {
        accessorKey: "total",
        cell: (info) => info.getValue(),
        header: "Total",
      },
    ],
    [],
  );

  return (
    <>
      <Head>
        <title>Reimbursements</title>
      </Head>
      <PageAnimation>
        <div className="grid h-72 gap-y-4 p-5">

          <div className="flex justify-between">
            <h4>Reimbursemets</h4>
            <div className="flex gap-2">
              <Input
                name="inputText"
                placeholder="Find anything..."
                icon={AiOutlineSearch}
              />
              <Button variant="success">Download</Button>
            </div>
          </div>

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
        </div>
      </PageAnimation>
    </>
  );
};

export default Reimbursements;
