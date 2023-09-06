/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCreditCard } from "react-icons-all-files/md/MdCreditCard";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { Button } from "~/components/core/Button";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/components/core/DashboardCard";
import SideDrawer from "~/components/core/SideDrawer";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table from "~/components/core/table";
import TableCheckbox from "~/components/core/table/TableCheckbox";
import { type FilterProps } from "~/components/core/table/filters/StatusFilter";
import ReimbursementsCardView from "~/components/reimbursement-view";
import {
  useGetAllRequestsQuery,
  useGetAnalyticsQuery,
  useGetRequestQuery,
} from "~/features/reimbursement-api-slice";
import {
  clearReimbursementForm,
  toggleCancelDialog,
  toggleFormDialog,
} from "~/features/reimbursement-form-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { ReimbursementDetailsSchema } from "~/schema/reimbursement-details.schema";
import {
  type ReimbursementDetailsDTO,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";

const Dialog = dynamic(() => import("~/components/core/Dialog"));
const ReimburseForm = dynamic(() => import("./reimburse-form"));

const StatusFilter = dynamic(
  () => import("~/components/core/table/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("~/components/core/table/filters/ExpenseTypeFilter"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("~/components/core/table/filters/ReimbursementTypeFilter"),
);

const MyReimbursements: React.FC = () => {
  const { formDialogIsOpen, cancelDialogIsOpen, reimbursementDetails } =
    useAppSelector((state) => state.reimbursementForm);
  const dispatch = useAppDispatch();

  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<string>();

  const { isLoading, data } = useGetAllRequestsQuery({});
  const { isLoading: analyticsIsLoading, data: analytics } =
    useGetAnalyticsQuery();
  const {
    isLoading: reimbursementRequestDataIsLoading,
    data: reimbursementRequestData,
  } = useGetRequestQuery(
    { id: focusedReimbursementId },
    { skip: !focusedReimbursementId },
  );

  const { isVisible, open, close } = useDialogState();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => {
          if (table.getRowModel().rows.length > 0) {
            return (
              <TableCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            );
          }
        },

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
        id: "request_status",
        accessorKey: "request_status",
        header: "Status",
        cell: (info) => (
          <StatusBadge
            status={(info.getValue() as string).toLowerCase() as StatusType}
          />
        ),
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        meta: {
          filterComponent: (info: FilterProps) => <StatusFilter {...info} />,
        },
      },
      {
        id: "reference_no",
        accessorKey: "reference_no",
        cell: (info) => info.getValue(),
        header: "R-ID",
      },
      {
        id: "request_type",
        accessorKey: "request_type",
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
        id: "expense_type",
        accessorKey: "expense_type",
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
        id: "created_at",
        accessorKey: "created_at",
        cell: (info) => dayjs(info.getValue() as string).format("MMM D, YYYY"),
        header: "Filed",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => <DateFiledFilter {...info} />,
        },
      },
      {
        id: "amount",
        accessorKey: "amount",
        cell: (info) => currencyFormat(info.getValue() as number),
        header: "Amount",
      },
      {
        id: "actions",
        accessorKey: "reimbursement_request_id",
        cell: (info) => (
          <Button
            buttonType="text"
            onClick={() => {
              setFocusedReimbursementId(info.getValue() as string);
              open();
            }}
          >
            View
          </Button>
        ),
        header: "",
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Form return for Details
  const useReimbursementDetailsFormReturn = useForm<ReimbursementDetailsDTO>({
    resolver: zodResolver(ReimbursementDetailsSchema),
    defaultValues: useMemo(() => {
      if (reimbursementDetails) {
        return { ...reimbursementDetails };
      }
    }, [reimbursementDetails]),
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
    dispatch(toggleCancelDialog());
  };

  /**Aborts reimbursement request cancellation */
  const handleAbortCancellation = () => {
    dispatch(toggleCancelDialog());
    dispatch(toggleFormDialog());
  };

  return (
    <>
      <div className="grid gap-y-2 p-5">
        <div className="mb-5 flex place-items-start gap-4">
          {analyticsIsLoading && (
            <>
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </>
          )}

          {!analyticsIsLoading && analytics && (
            <>
              <DashboardCard
                icon={
                  <MdAccessTimeFilled className="h-5 w-5 text-yellow-600" />
                }
                label="Pending Approval"
                count={analytics.myPendingRequest.count}
              />
              <DashboardCard
                icon={<MdCreditCard className="text-informative-600 h-5 w-5" />}
                label="Overall Total"
                count={analytics.myTotalRequest.count}
              />
            </>
          )}
        </div>

        <div className="flex justify-between">
          <h4>Reimbursements</h4>
          <Button onClick={() => dispatch(toggleFormDialog())}>
            Reimburse
          </Button>
        </div>

        {!isLoading && data && (
          <Table
            loading={isLoading}
            data={data}
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
        )}

        {/* TODO: TableSkeleton */}
      </div>

      <Dialog
        title="File a Reimbursement"
        isVisible={formDialogIsOpen}
        close={handleOpenCancelDialog}
      >
        <ReimburseForm
          formReturn={useReimbursementDetailsFormReturn}
          handleOpenCancelDialog={handleOpenCancelDialog}
        />
      </Dialog>

      <Dialog
        title="Cancel Reimbursements?"
        isVisible={cancelDialogIsOpen}
        close={handleAbortCancellation}
      >
        <div className="flex flex-col gap-8 pt-8">
          <p className="text-neutral-800">
            Are you sure you want to cancel reimbursement request?
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={handleAbortCancellation}
            >
              No
            </Button>
            <Button
              variant="danger"
              className="w-1/2"
              onClick={handleConfirmCancellation}
            >
              Yes
            </Button>
          </div>
        </div>
      </Dialog>

      <SideDrawer
        title={
          !isLoading && reimbursementRequestData
            ? reimbursementRequestData.reference_no
            : "..."
        }
        isVisible={isVisible}
        closeDrawer={close}
      >
        <ReimbursementsCardView
          closeDrawer={close}
          isLoading={reimbursementRequestDataIsLoading}
          data={reimbursementRequestData}
        />
      </SideDrawer>
    </>
  );
};

export default MyReimbursements;