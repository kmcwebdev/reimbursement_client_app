import React, { useState } from "react";
import { AiOutlinePause } from "react-icons-all-files/ai/AiOutlinePause";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import DashboardCard, { DashboardCardSkeleton } from "../core/DashboardCard";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { useGetAnalyticsQuery } from "~/features/reimbursement-api-slice";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { sampleData } from "~/utils/sampleData";
import { Button } from "../core/Button";
import ButtonGroup from "../core/form/fields/ButtonGroup";
import Input from "../core/form/fields/Input";
import Table from "../core/table";
import TableCheckbox from "../core/table/TableCheckbox";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";
import ExpenseTypeFilter from "../core/table/filters/ExpenseTypeFilter";
import { type FilterProps } from "../core/table/filters/StatusFilter";

const ReimbursementTypeFilter = dynamic(
  () => import("../core/table/filters/ReimbursementTypeFilter"),
);
const ClientFilter = dynamic(
  () => import("../core/table/filters/ClientFilter"),
);

const Payables: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { isLoading: analyticsIsLoading, data: analytics } =
    useGetAnalyticsQuery();

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
        cell: ({ row }) => (
          <div className="px-4">
            <TableCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        id: "client",
        accessorKey: "client",
        cell: (info) => info.getValue(),
        header: "Client",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => <ClientFilter {...info} />,
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
        header: "Approved",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => <DateFiledFilter {...info} />,
        },
      },
      {
        id: "payrollAccount",
        accessorKey: "payrollAccount",
        cell: (info) => info.getValue(),
        header: "Payroll Account",
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
      <div className="grid gap-y-2 p-5">
        <div className="mb-5 flex place-items-start gap-4">
          {analyticsIsLoading && (
            <>
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </>
          )}

          {!analyticsIsLoading && analytics && (
            <>
              <DashboardCard
                icon={<MdGavel className="h-5 w-5 text-orange-600" />}
                label="Pending Approval"
                count={analytics.myPendingRequest.count}
              />
              <DashboardCard
                icon={<MdAccessTimeFilled className="h-5 w-5 text-blue-600" />}
                label="Scheduled/Unscheduled"
                count={analytics.others?.totalScheduledRequest.count || 0}
                totalCount={
                  analytics.others?.totalUnScheduledRequest.count || 0
                }
              />
              <DashboardCard
                icon={<AiOutlinePause className="h-5 w-5 text-yellow-600" />}
                label="On-Hold"
                count={analytics.others?.totalOnholdRequest.count || 0}
              />
            </>
          )}
        </div>

        {/* table */}
        <div className="flex justify-between">
          <h4>For Processing</h4>
          <div className="flex gap-2">
            <Input
              name="inputText"
              placeholder="Find anything..."
              icon={AiOutlineSearch as IconType}
            />

            <Button variant="neutral" buttonType="outlined">
              Hold
            </Button>
            <Button variant="danger" buttonType="outlined">
              Reject
            </Button>
            <Button variant="success">Download Report</Button>
          </div>
        </div>

        <div className="w-52">
          <ButtonGroup
            handleChange={(e) => console.log(e)}
            label=""
            name=""
            options={[
              { label: "Pending", value: "Pending" },
              { label: "On-Hold", value: "On-Hold" },
            ]}
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
    </>
  );
};

export default Payables;
