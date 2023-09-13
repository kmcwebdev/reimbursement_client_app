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
import { HiPlusCircle } from "react-icons-all-files/hi/HiPlusCircle";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCreditCard } from "react-icons-all-files/md/MdCreditCard";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { Button } from "~/components/core/Button";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/components/core/DashboardCard";
import SideDrawer from "~/components/core/SideDrawer";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table from "~/components/core/table";
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
import {
  setColumnFilters,
  setSelectedItems,
} from "~/features/reimbursement-request-page-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
  ReimbursementDetailsSchema,
  type ReimbursementDetailsType,
} from "~/schema/reimbursement-details.schema";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import SkeletonLoading from "../core/SkeletonLoading";
import TableSkeleton from "../core/table/TableSkeleton";
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

  const { selectedItems, columnFilters } = useAppSelector(
    (state) => state.reimbursementRequestPageState,
  );
  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: string[]) => {
    dispatch(setSelectedItems(value));
  };

  const setColumnFiltersState = (value: ColumnFiltersState) => {
    dispatch(setColumnFilters(value));
  };

  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<string>();

  const { isFetching, data } = useGetAllRequestsQuery({});
  const { isFetching: analyticsIsLoading, data: analytics } =
    useGetAnalyticsQuery();

  const {
    isFetching: reimbursementRequestDataIsLoading,
    isError: reimbursementRequestDataIsError,

    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { reimbursement_request_id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const { isVisible, open, close } = useDialogState();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(() => {
    return [
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
        size: 10,
        meta: {
          filterComponent: (info: FilterProps) => (
            <StatusFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
        },
      },
      {
        id: "reference_no",
        accessorKey: "reference_no",
        cell: (info) => info.getValue(),
        header: "R-ID",
        size: 20,
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
            <ReimbursementTypeFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
        },
        size: 10,
      },
      {
        id: "expense_type",
        accessorKey: "expense_type",
        cell: (info) => info.getValue(),
        header: "Expense",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        size: 10,
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
        id: "created_at",
        accessorKey: "created_at",
        cell: (info) => dayjs(info.getValue() as string).format("MMM D, YYYY"),
        header: "Filed",
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
        size: 10,
      },
      {
        id: "amount",
        accessorKey: "amount",
        cell: (info) => currencyFormat(info.getValue() as number),
        header: "Total",
        size: 10,
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
        size: 5,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Form return for Details
  const useReimbursementDetailsFormReturn = useForm<ReimbursementDetailsType>({
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
    dispatch(
      appApiSlice.util.invalidateTags([
        {
          type: "ExpenseTypes",
          id: useReimbursementDetailsFormReturn.getValues(
            "reimbursement_request_type_id",
          ),
        },
      ]),
    );
    dispatch(toggleFormDialog());
  };

  return (
    <>
      <div className="grid gap-y-2 p-5">
        <div className="mb-5 flex place-items-start gap-4 md:overflow-x-auto">
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

          {isFetching && <SkeletonLoading className="h-10 w-[5rem] rounded" />}

          {!isFetching && (
            <>
              <Button
                className="hidden md:block"
                onClick={() => dispatch(toggleFormDialog())}
              >
                Reimburse
              </Button>

              <Button
                buttonType="text"
                className="block md:hidden"
                onClick={() => dispatch(toggleFormDialog())}
              >
                <HiPlusCircle className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {!isFetching && data && (
          <Table
            type="reimbursements"
            loading={isFetching}
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

        {isFetching && <TableSkeleton />}
      </div>

      <Dialog
        title="File a Reimbursement"
        isVisible={formDialogIsOpen}
        close={handleOpenCancelDialog}
        hideCloseIcon
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
        hideCloseIcon
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
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Dialog>

      <SideDrawer
        title={
          !reimbursementRequestDataIsLoading && reimbursementRequestData
            ? reimbursementRequestData.reference_no
            : reimbursementRequestDataIsError
            ? "Error"
            : "..."
        }
        isVisible={isVisible}
        closeDrawer={close}
      >
        <ReimbursementsCardView
          closeDrawer={close}
          isLoading={reimbursementRequestDataIsLoading}
          isError={reimbursementRequestDataIsError}
          data={reimbursementRequestData}
        />
      </SideDrawer>
    </>
  );
};

export default MyReimbursements;
