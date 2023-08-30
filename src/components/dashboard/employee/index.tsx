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
import PageAnimation from "~/components/animation/PageAnimation";
import { Button } from "~/components/core/Button";
import DashboardCard from "~/components/core/DashboardCard";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table, { type Reimbursement } from "~/components/core/table";
import TableCheckbox from "~/components/core/table/TableCheckbox";
import DateFiledFilter from "~/components/core/table/filters/DateFiledFilter";
import { type FilterProps } from "~/components/core/table/filters/StatusFilter";
import { useDialogState } from "~/hooks/use-dialog-state";
import { currencyFormat } from "~/utils/currencyFormat";
import { sampleData } from "~/utils/sampleData";

const Dialog = dynamic(() => import("~/components/core/Dialog"));
const ReimburseForm = dynamic(
  () => import("~/components/dashboard/employee/reimburse-form"),
);

const StatusFilter = dynamic(
  () => import("~/components/core/table/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("~/components/core/table/filters/ExpenseTypeFilter"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("~/components/core/table/filters/ReimbursementTypeFilter"),
);

const EmployeeDashboard: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    isVisible: reimburseFormIsVisible,
    open: openReimburseForm,
    close: closeReimburseForm,
  } = useDialogState();

  //TODO: Move State to Redux store
  const [activeStep, setActiveStep] = useState<number>(0);

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
        id: "r-id",
        accessorKey: "reimbursementId",
        cell: (info) => info.getValue(),
        header: "ID",
      },
      {
        id: "id",
        accessorKey: "id",
        cell: (info) => info.getValue(),
        header: "ID",
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
        id: "actions",
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
        <title>Employee Dashboard</title>
      </Head>

      <PageAnimation>
        <div className="grid gap-y-2 p-5">
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
            <h4>Reimbursements</h4>
            <Button onClick={openReimburseForm}>Reimburse</Button>
          </div>

          <Table
            data={sampleData}
            columns={columns}
            tableState={{
              pagination,
              selectedItems,
              columnFilters,
            }}
            tableStateActions={{
              setColumnFilters,
              setSelectedItems,
              setPagination,
            }}
          />
        </div>

        <Dialog
          title="File a Reimbursement"
          isVisible={reimburseFormIsVisible}
          close={closeReimburseForm}
        >
          <ReimburseForm
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </Dialog>
      </PageAnimation>
    </>
  );
};

export default EmployeeDashboard;
