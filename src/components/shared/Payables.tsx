/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  setColumnFilters,
  setSelectedItems,
} from "~/features/finance-page-slice";
import {
  useGetAllApprovalQuery,
  useGetAnalyticsQuery,
} from "~/features/reimbursement-api-slice";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import CollapseWidthAnimation from "../animation/CollapseWidth";
import { Button } from "../core/Button";
import ButtonGroup from "../core/form/fields/ButtonGroup";
import Input from "../core/form/fields/Input";
import Table from "../core/table";
import TableSkeleton from "../core/table/TableSkeleton";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";
import ExpenseTypeFilter from "../core/table/filters/ExpenseTypeFilter";
import { type FilterProps } from "../core/table/filters/StatusFilter";
import { env } from "~/env.mjs";
import axios from 'axios';

const ReimbursementTypeFilter = dynamic(
  () => import("../core/table/filters/ReimbursementTypeFilter"),
);
const ClientFilter = dynamic(
  () => import("../core/table/filters/ClientFilter"),
);

const Payables: React.FC = () => {
  const { selectedItems, columnFilters } = useAppSelector(
    (state) => state.financePageState,
  );

  const { accessToken } = useAppSelector((state) => state.session)

  const downloadReport = async () => {
    const response = await axios.get(`${env.NEXT_PUBLIC_BASEAPI_URL}/api/finance/reimbursements/requests/reports/finance`, {
        responseType: 'blob', // Important to set this
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${accessToken}`,
        },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', 'filename.csv');

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: string[]) => {
    dispatch(setSelectedItems(value));
  };

  const { isLoading, data } = useGetAllApprovalQuery({});

  const setColumnFiltersState = (value: ColumnFiltersState) => {
    dispatch(setColumnFilters(value));
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { isLoading: analyticsIsLoading, data: analytics } =
    useGetAnalyticsQuery();

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(
    () => [
      {
        id: "client",
        accessorKey: "client",
        cell: (info) => info.getValue(),
        header: "Client",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => (
            <ClientFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
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
            <ReimbursementTypeFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
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
            <ExpenseTypeFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
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
          filterComponent: (info: FilterProps) => (
            <DateFiledFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
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
    [data],
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

          <div className="flex gap-4">
            <Input
              name="inputText"
              placeholder="Find anything..."
              icon={AiOutlineSearch as IconType}
            />

            <CollapseWidthAnimation
              isVisible={data && data.length > 0 ? true : false}
            >
              <Button variant="success" className="whitespace-nowrap" onClick={() => void downloadReport()}>
                Download Report
              </Button>
            </CollapseWidthAnimation>
          </div>
        </div>

        <CollapseWidthAnimation
          isVisible={data && data.length > 0 ? true : false}
        >
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
        </CollapseWidthAnimation>

        {!isLoading && data && (
          <Table
            type="approvals"
            loading={isLoading}
            data={data}
            columns={columns}
            tableState={{
              pagination,
              selectedItems,
              columnFilters,
            }}
            tableStateActions={{
              setColumnFilters: setColumnFiltersState,
              setSelectedItems: setSelectedItemsState,
              setPagination,
            }}
          />
        )}

        {isLoading && <TableSkeleton />}
      </div>
    </>
  );
};

export default Payables;
