/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import DashboardCard from "~/components/core/DashboardCard";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table, { type Reimbursement } from "~/components/core/Table";
import StatusFilter, { type FilterProps } from "~/components/core/Table/filters/StatusFilter";
import Input from "~/components/core/form/fields/Input";
import { currencyFormat } from "~/utils/currencyFormat";
import { sampleData } from "~/utils/sampleData";
import PageAnimation from "../animation/PageAnimation";
import TableCheckbox from "../core/Table/TableCheckbox";
import DateFiledFilter from "../core/Table/filters/DateFiledFilter";
import ExpenseTypeFilter from "../core/Table/filters/ExpenseTypeFilter";
import { type ColumnDef, type ColumnFiltersState, type PaginationState } from "@tanstack/react-table";
import Head  from "next/head";


const ManagerDashboard: React.FC = () => {
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
          <div className="flex gap-4 place-items-start mb-3">
            <DashboardCard
              icon={<MdGavel className="h-5 w-5 text-[#D89B0D]" />}
              label="Pending Approval"
              count={16}
            />
            <DashboardCard
              icon={<MdAccessTimeFilled className="h-5 w-5 text-[#2463bc]" />}
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

export default ManagerDashboard;
