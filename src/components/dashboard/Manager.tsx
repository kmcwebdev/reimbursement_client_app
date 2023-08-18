/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import PageAnimation from "../animation/PageAnimation";
import Head from 'next/head';
import DashboardCard from "~/components/core/DashboardCard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import Table, { type Reimbursement } from "~/components/core/Table";
import { sampleData } from "~/utils/sampleData";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import IndeterminateCheckbox from "~/components/core/Table/IndeterminateCheckbox";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import dynamic from "next/dynamic";
import Input from "~/components/core/form/fields/Input";

const StatusTypeFilter = dynamic(
  () => import("~/components/core/Table/filters/StatusTypeFilter"),
);

const ManagerDashboard: React.FC = () => {
  const columns = React.useMemo<ColumnDef<Reimbursement>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
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
          filterComponent: StatusTypeFilter,
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
          filterComponent: StatusTypeFilter,
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
          filterComponent: StatusTypeFilter,
        },
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
    ],
    [],
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  return (
    <>
      <Head>
        <title>Manager Dashboard</title>
      </Head>
      <PageAnimation>
        <div className="grid h-72 p-5 gap-y-5">
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
              <h4>For Approval</h4>
              <Input name="inputText" placeholder="Find anything..." icon={AiOutlineSearch} />
            </div>
            <Table

              data={sampleData}
              columns={columns}
              pagination={pagination}
              setPagination={setPagination}
              />
        </div>
      </PageAnimation>
    </>
  );
};

export default ManagerDashboard;
