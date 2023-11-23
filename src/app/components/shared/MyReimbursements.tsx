/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons-all-files/ai/AiOutlinePlusCircle";
import { Button } from "~/app/components/core/Button";
import StatusBadge, { type StatusType } from "~/app/components/core/StatusBadge";
import Table from "~/app/components/core/table";
import { type FilterProps } from "~/app/components/core/table/filters/StatusFilter";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { setSelectedItems } from "~/features/page-state.slice";
import {
    useGetAllRequestsQuery,
    useGetRequestQuery,
} from "~/features/reimbursement-api-slice";
import {
    clearReimbursementForm,
    toggleCancelDialog,
    toggleFormDialog,
} from "~/features/reimbursement-form-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
    ReimbursementDetailsSchema,
    type ReimbursementDetailsType,
} from "~/schema/reimbursement-details.schema";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import SkeletonLoading from "../core/SkeletonLoading";
import MemberAnalytics from "./analytics/MemberAnalytics";

const ReimbursementsCardView = dynamic(
  () => import("~/app/components/reimbursement-view"),
);
const Dialog = dynamic(() => import("~/app/components/core/Dialog"));
const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));
const ReimburseForm = dynamic(() => import("./reimburse-form"));
const StatusFilter = dynamic(
  () => import("~/app/components/core/table/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("~/app/components/core/table/filters/ExpenseTypeFilter"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("~/app/components/core/table/filters/ReimbursementTypeFilter"),
);
const DateFiledFilter = dynamic(
  () => import("~/app/components/core/table/filters/DateFiledFilter"),
);

const MyReimbursements: React.FC = () => {
  const { formDialogIsOpen, cancelDialogIsOpen, reimbursementDetails } =
    useAppSelector((state) => state.reimbursementForm);
  const { selectedItems, filters } = useAppSelector(
    (state) => state.pageTableState,
  );
  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: string[]) => {
    dispatch(setSelectedItems(value));
  };

  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<string>();

  const { isFetching, data } = useGetAllRequestsQuery(filters);

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
        id: "finance_request_status",
        accessorKey: "finance_request_status",
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
        header: "Total",
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
  }, [data]);

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
    const selectedReimbursementType =
      useReimbursementDetailsFormReturn.getValues(
        "reimbursement_request_type_id",
      );
    dispatch(toggleFormDialog());

    if (selectedReimbursementType) {
      dispatch(toggleCancelDialog());
    }
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
      <div className="grid bg-neutral-50 md:gap-y-4 lg:p-5">
        <MemberAnalytics />

        <div className="flex items-center justify-between p-4 lg:p-0">
          <h4>Reimbursements</h4>
          {isFetching && (
            <SkeletonLoading className="h-5 w-5 rounded-full md:h-10 md:w-[5rem] md:rounded" />
          )}
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
                <AiOutlinePlusCircle className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        <Table
          type="reimbursements"
          loading={isFetching}
          data={data}
          columns={columns}
          handleMobileClick={(e: string) => {
            setFocusedReimbursementId(e);
            open();
          }}
          tableState={{
            filters,
            pagination,
            selectedItems,
          }}
          tableStateActions={{
            setSelectedItems: setSelectedItemsState,
            setPagination,
          }}
        />
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
          setFocusedReimbursementId={setFocusedReimbursementId}
        />
      </SideDrawer>
    </>
  );
};

export default MyReimbursements;
