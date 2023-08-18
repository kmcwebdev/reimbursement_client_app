/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import PageAnimation from "../animation/PageAnimation";
import Head from 'next/head';
import DashboardCard from "~/components/core/DashboardCard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { AiOutlinePause } from "react-icons-all-files/ai/AiOutlinePause";
import Table, { type Reimbursement } from "~/components/core/Table";
import { sampleData } from "~/utils/sampleData";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import IndeterminateCheckbox from "~/components/core/Table/IndeterminateCheckbox";
import dynamic from "next/dynamic";
import Input from "~/components/core/form/fields/Input";
import { Button } from "~/components/core/Button";
import ButtonGroup from "~/components/core/form/fields/ButtonGroup";

const StatusTypeFilter = dynamic(
  () => import("~/components/core/Table/filters/StatusTypeFilter"),
);

const FinanceDashboard: React.FC = () => {

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
        cell: ({ row }) => (
          <div className="px-4">
            <IndeterminateCheckbox
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
        accessorKey: "client",
        cell: (info) => info.getValue(),
        header: "Client",
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
        header: "Approved",
      },
      {
        accessorKey: "payrollAccount",
        cell: (info) => info.getValue(),
        header: "Payroll Account",
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
        <title>Finance Dashboard</title>
      </Head>
      <PageAnimation>
        <div className="grid h-72 p-5 gap-y-2">
          {/* card */}
          <div className="flex gap-4 place-items-start mb-5">
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
            <DashboardCard
              icon={<AiOutlinePause className="h-5 w-5 text-[#D89B0D]" />}
              label="On-Hold"
              count={5}
            />
          </div>

          {/* table */}
            <div className="flex justify-between">
              <h4>For Processing</h4>
              <div className="flex gap-2">
                <Input name="inputText" placeholder="Find anything..." icon={AiOutlineSearch} />
                
                <Button variant="neutral" buttonType='outlined'>Hold</Button>
                <Button variant="danger"  buttonType='outlined'>Reject</Button>
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
              pagination={pagination}
              setPagination={setPagination}
              />
        </div>
      </PageAnimation>
    </>
  );
};

export default FinanceDashboard;
