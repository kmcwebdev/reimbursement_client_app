/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState } from "react";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCreditCard } from "react-icons-all-files/md/MdCreditCard";
import { MdSearch } from "react-icons-all-files/md/MdSearch";
import { Button } from "~/components/core/Button";
import DashboardCard from "~/components/core/DashboardCard";
import Table, { type Reimbursement } from "~/components/core/Table";
import { type FilterProps } from "~/components/core/Table/filters/StatusFilter";
import { currencyFormat } from "~/utils/currencyFormat";
import { sampleData } from "~/utils/sampleData";
import PageAnimation from "../animation/PageAnimation";
import StatusBadge, { type StatusType } from "../core/StatusBadge";
import TableCheckbox from "../core/Table/TableCheckbox";
import DateFiledFilter from "../core/Table/filters/DateFiledFilter";
import ExpenseTypeFilter from "../core/Table/filters/ExpenseTypeFilter";
import Input from "../core/form/fields/Input";

const ReimbursementTypeFilter = dynamic(
  () => import("../core/Table/filters/ReimbursementTypeFilter"),
);
const StatusFilter = dynamic(
  () => import("../core/Table/filters/StatusFilter"),
);

const EmployeeDashboard: React.FC = () => {
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
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue() as StatusType} />,
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        meta: {
          filterComponent: (info: FilterProps) => <StatusFilter {...info} />,
        },
      },
      {
        id: "id",
        accessorKey: "id",
        cell: (info) => info.getValue(),
        header: "ID",
      },
      {
        id: "name",
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: "Name",
      },
      {
        id: "reimbursementId",
        accessorKey: "reimbursementId",
        cell: (info) => info.getValue(),
        header: "R-ID",
      },

      {
        id: "type",
        accessorKey: "type",
        cell: (info) => info.getValue(),
        header: "Type",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => (
            <ReimbursementTypeFilter {...info} />
          ),
        },
      },
      {
        id: "expense",
        accessorKey: "expense",
        cell: (info) => info.getValue(),
        header: "Expense",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => (
            <ExpenseTypeFilter {...info} />
          ),
        },
      },
      {
        id: "filed",
        accessorKey: "filed",
        cell: (info) => info.getValue(),
        header: "Filed",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => <DateFiledFilter {...info} />,
        },
      },
      {
        id: "total",
        accessorKey: "total",
        cell: (info) => currencyFormat(info.getValue() as number),
        header: "Total",
      },
      {
        id: "r-id",
        accessorKey: "r-id",
        cell: () => <Button buttonType="text">View</Button>,
        header: "",
      },
    ],
    [],
  );

  return (
    <>
      <Head>
        <title>HRBP Dashboard</title>
      </Head>

      <PageAnimation>
        <div className="grid h-72 gap-y-2 p-5">
          <div className="mb-5 flex place-items-start gap-4">
            <DashboardCard
              icon={<MdAccessTimeFilled className="h-5 w-5 text-[#D89B0D]" />}
              label="Pending Approval"
              count={2}
            />
            <DashboardCard
              icon={<MdCreditCard className="h-5 w-5 text-[#2463bc]" />}
              label="Overall Total"
              count={2}
            />
          </div>

          <div className="flex justify-between">
            <h4>For Approval</h4>
            <Input
              name="searchFilter"
              placeholder="Find anything..."
              icon={MdSearch}
            />
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

export default EmployeeDashboard;
