/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Head from "next/head";
import React from "react";
// import { type IconType } from "react-icons-all-files";
// import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import PageAnimation from "~/components/animation/PageAnimation";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
// import EmptyState from "~/components/core/EmptyState";
import Input from "~/components/core/form/fields/Input";
import { Button } from "~/components/core/Button";
import Table, { type Reimbursement } from "~/components/core/Table";
import { sampleData } from "~/utils/sampleData";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import IndeterminateCheckbox from "~/components/core/Table/IndeterminateCheckbox";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import dynamic from "next/dynamic";

const StatusTypeFilter = dynamic(
  () => import("~/components/core/Table/filters/StatusTypeFilter"),
);

const Reimbursements: React.FC = () => {

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
        header: "fileds",
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
        <title>Reimbursements</title>
      </Head>
      <PageAnimation>
        {/* <div className="grid h-72 w-full place-items-center rounded-md bg-white">
          <EmptyState
            title="Reimbursements is empty"
            description="Wala pa kasing nagagawa na hayop ka! Magcode ka"
            icon={MdDashboard as IconType}
          >
            <div className="bg-primary-normal h-10 w-32 rounded-md"></div>
          </EmptyState>
        </div> */}
        <div className="grid h-72 p-5 gap-y-4">

          {/* table */}
            <div className="flex justify-between">
              <h4>Reimburesemets</h4>
              <div className="flex gap-2">
                <Input name="inputText" placeholder="Find anything..." icon={AiOutlineSearch} />
                <Button variant="success">Download</Button>
              </div>
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

export default Reimbursements;
