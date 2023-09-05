/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import Head from "next/head";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import DashboardCard from "~/components/core/DashboardCard";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Input from "~/components/core/form/fields/Input";
import Table from "~/components/core/table";
import StatusFilter, {
  type FilterProps,
} from "~/components/core/table/filters/StatusFilter";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import PageAnimation from "../animation/PageAnimation";
import TableCheckbox from "../core/table/TableCheckbox";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";
import ExpenseTypeFilter from "../core/table/filters/ExpenseTypeFilter";
import { useGetAllRequestsQuery } from "~/features/reimbursement-api-slice";

const ManagerDashboard: React.FC = () => {

  const { isLoading, data } = useGetAllRequestsQuery();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <TableCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
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
        meta: {
          filterComponent: StatusFilter,
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
          filterComponent: StatusFilter,
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
    ],
    [],
  );
  return (
    <>
      <Head>
        <title>Manager Dashboard</title>
      </Head>
      <PageAnimation>
        <div className="grid gap-y-5 p-5">
          {/* card */}
          <div className="mb-3 flex place-items-start gap-4">
            <DashboardCard
              icon={<MdGavel className="h-5 w-5 text-orange-600" />}
              label="Pending Approval"
              count={16}
            />
            <DashboardCard
              icon={<MdAccessTimeFilled className="h-5 w-5 text-blue-600" />}
              label="Pending Approval"
              count={50}
              totalCount={20}
            />
          </div>

          {/* table */}
          <div className="flex justify-between">
            <h4 className="font-karla">For Approval</h4>
            <Input
              name="inputText"
              placeholder="Find anything..."
              icon={AiOutlineSearch}
            />
          </div>

          {!isLoading && data && (
            <Table
              data={data}
              columns={columns}
              tableState={{ pagination, selectedItems, columnFilters }}
              tableStateActions={{
                setColumnFilters,
                setSelectedItems,
                setPagination,
              }}
            />
          )}
        </div>
      </PageAnimation>
    </>
  );
};

export default ManagerDashboard;
