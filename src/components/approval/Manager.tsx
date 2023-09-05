/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
  } from "@tanstack/react-table";
import Head from "next/head";
import PageAnimation from "../animation/PageAnimation";
import DashboardCard from "../core/DashboardCard";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import Input from "../core/form/fields/Input";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import Table from "~/components/core/table";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { sampleData } from "~/utils/sampleData";
import TableCheckbox from "../core/table/TableCheckbox";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import StatusFilter, {
  type FilterProps,
} from "~/components/core/table/filters/StatusFilter";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";
import ExpenseTypeFilter from "../core/table/filters/ExpenseTypeFilter";
import { currencyFormat } from "~/utils/currencyFormat";
import dynamic from "next/dynamic";

const ReimbursementTypeFilter = dynamic(
    () => import("../core/table/filters/ReimbursementTypeFilter"),
  );

const ManagerApproval: React.FC = () => {
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
      ],
      [],
    );
    
    return (
        <>
            <Head>
                <title>Manager Approval</title>
            </Head>
            <PageAnimation>

            <div className="grid w-full gap-y-2 md:p-5">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row">
                    <DashboardCard
                    icon={<MdGavel className="h-5 w-5 text-orange-600" />}
                    label="Pending Approval"
                    count={16}
                    />
                    <DashboardCard
                    icon={<MdAccessTimeFilled className="h-5 w-5 text-blue-600" />}
                    label="Overall Total"
                    count={50}
                    totalCount={20}
                    />
                </div>


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
    )
}

export default ManagerApproval;