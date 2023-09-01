/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCreditCard } from "react-icons-all-files/md/MdCreditCard";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import PageAnimation from "~/components/animation/PageAnimation";
import { Button } from "~/components/core/Button";
import DashboardCard from "~/components/core/DashboardCard";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table, { type Reimbursement } from "~/components/core/table";
import TableCheckbox from "~/components/core/table/TableCheckbox";
import DateFiledFilter from "~/components/core/table/filters/DateFiledFilter";
import { type FilterProps } from "~/components/core/table/filters/StatusFilter";
import {
  clearReimbursementForm,
  toggleCancelDialog,
  toggleFormDialog,
} from "~/features/reimbursement-form-slice";
import { reimbursementDetailsSchema } from "~/schema/reimbursement-details.schema";
import {
  type ReimbursementAttachmentsDTO,
  type ReimbursementDetailsDTO,
} from "~/types/reimbursement.types";
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
  const {
    activeStep,
    formDialogIsOpen,
    cancelDialogIsOpen,
    reimbursementDetails,
  } = useAppSelector((state) => state.reimbursementForm);
  const dispatch = useAppDispatch();

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

  //Form return for Details
  const useReimbursementDetailsFormReturn = useForm<ReimbursementDetailsDTO>({
    resolver: zodResolver(reimbursementDetailsSchema),
    defaultValues: useMemo(() => {
      if (reimbursementDetails) {
        return { ...reimbursementDetails };
      }
    }, [reimbursementDetails]),
    // mode: "onChange",
  });

  //Form return for Attachments
  const useReimbursementAttachmentsFormReturn =
    useForm<ReimbursementAttachmentsDTO>({
      resolver: zodResolver(reimbursementDetailsSchema),
      // defaultValues: useMemo(() => {
      //   if (reimbursementAttachments) {
      //     return { ...reimbursementAttachments };
      //   }
      // }, [reimbursementAttachments]),
      mode: "onChange",
    });

  /***Closes the form and open cancel dialog */
  const handleOpenCancelDialog = () => {
    dispatch(toggleFormDialog());
    dispatch(toggleCancelDialog());
  };

  /**Continue reimbursement request cancellation */
  const handleConfirmCancellation = () => {
    dispatch(clearReimbursementForm());
    useReimbursementDetailsFormReturn.reset();
    useReimbursementAttachmentsFormReturn.reset();
    dispatch(toggleCancelDialog());
  };

  /**Aborts reimbursement request cancellation */
  const handleAbortCancellation = () => {
    dispatch(toggleCancelDialog());
    dispatch(toggleFormDialog());
  };

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
            <Button onClick={() => dispatch(toggleFormDialog())}>
              Reimburse
            </Button>
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
          isVisible={formDialogIsOpen}
          close={handleOpenCancelDialog}
        >
          <ReimburseForm
            formReturn={
              activeStep === 0
                ? useReimbursementDetailsFormReturn
                : useReimbursementAttachmentsFormReturn
            }
            handleOpenCancelDialog={handleOpenCancelDialog}
          />
        </Dialog>

        <Dialog
          title="Cancel Reimbursements?"
          isVisible={cancelDialogIsOpen}
          close={handleAbortCancellation}
        >
          <div className="flex flex-col gap-8 pt-8">
            <p className="text-neutral-default">
              Are you sure you want to cancel reimbursement request?
            </p>

            <div className="flex justify-end">
              <Button
                variant="danger"
                className="w-1/2"
                onClick={handleConfirmCancellation}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      </PageAnimation>
    </>
  );
};

export default EmployeeDashboard;
