/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { zodResolver } from "@hookform/resolvers/zod";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
// import { AiOutlinePlusCircle } from "react-icons-all-files/ai/AiOutlinePlusCircle";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { Button } from "~/app/components/core/Button";
import Table from "~/app/components/core/table";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import {
  useGetAdminListQuery,
  useGetRequestQuery,
} from "~/features/api/reimbursement-api-slice";
import {
  clearReimbursementForm,
  toggleCancelDialog,
  toggleFormDialog,
} from "~/features/state/reimbursement-form-slice";
import { setSelectedItems } from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import { useDialogState } from "~/hooks/use-dialog-state";
import { useReportDownload } from "~/hooks/use-report-download";
import {
  ReimbursementTypeSchema,
  type ReimbursementFormType,
} from "~/schema/reimbursement-type.schema";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
} from "~/types/reimbursement.types";
import { env } from "../../../../env.mjs";
import CollapseWidthAnimation from "../animation/CollapseWidth";
import SkeletonLoading from "../core/SkeletonLoading";
import { showToast } from "../core/Toast";
import Input from "../core/form/fields/Input";
import TableCell from "../core/table/TableCell";
import AdminAnalytics from "./analytics/AdminAnalytics";
import ReimburseForm from "./reimburse-form";

const ReimbursementsCardView = dynamic(
  () => import("~/app/components/reimbursement-view"),
);
const Dialog = dynamic(() => import("~/app/components/core/Dialog"));
const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));
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

const MyAdmin: React.FC = () => {
  const {
    formDialogIsOpen,
    cancelDialogIsOpen,
    reimbursementFormValues,
    activeStep,
    particularDetailsFormIsVisible,
    selectedAttachmentMethod,
  } = useAppSelector((state) => state.reimbursementForm);
  const { selectedItems, filters } = useAppSelector(
    (state) => state.pageTableState,
  );
  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: number[]) => {
    dispatch(setSelectedItems(value));
  };

  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<number>();

  const [downloadReportLoading, setDownloadReportLoading] = useState(false);

  const {
    isFetching: focusedReimbursementDataIsFetching,
    isError: focusedReimbursementDataIsError,
    currentData: focusedReimbursementData,
  } = useGetRequestQuery(
    { id: +focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const { isVisible, open, close } = useDialogState();
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useState<IReimbursementsFilterQuery>({
    search: undefined,
    expense_type__id: undefined,
    request_type__id: undefined,
    created_at_before: undefined,
    created_at_after: undefined,
  });

  const debouncedSearchText = useDebounce(searchParams.search, 500);

  const { isFetching, data } = useGetAdminListQuery({
    ...filters,
    search: debouncedSearchText,
  });

  const columns = React.useMemo<ColumnDef<IReimbursementRequest>[]>(() => {
    const defaultColumns: ColumnDef<IReimbursementRequest, unknown>[] = [
      {
        id: "request_status",
        accessorKey: "request_status",
        header: "Status",
        filterFn: (row, value: string) => {
          return value.includes(row.original.request_status.name);
        },
        meta: {
          filterComponent: StatusFilter,
        },
      },
      {
        id: "client_name",
        accessorKey: "client_name",
        header: "Client",
        cell: (info) => info.getValue(),
      },
      {
        id: "reference_no",
        accessorKey: "reference_no",
        header: "ID",
      },
      {
        id: "full_name",
        accessorKey: "full_name",
        cell: (info) => info.getValue(),
        header: "Name",
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
        header: "Type",
        filterFn: (row, value: string) => {
          return value.includes(row.original.request_type.name);
        },
        meta: {
          filterComponent: ReimbursementTypeFilter,
        },
      },
      {
        id: "particulars",
        accessorKey: "particulars",
        header: "Expense",
        filterFn: (row, id, value: string) => {
          return value.includes(row.original.particulars[0].expense_type.name);
        },
        meta: {
          filterComponent: ExpenseTypeFilter,
        },
        size: 30,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Filed",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: DateFiledFilter,
        },
      },
      {
        id: "total_amount",
        accessorKey: "total_amount",
        header: "Total",
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "",
        setFocusedReimbursementId: setFocusedReimbursementId,
        openDrawer: open,
      },
    ];

    defaultColumns.forEach((a) => {
      a.cell = TableCell;
    });

    return defaultColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //Form return for reimbursement type selection
  const useReimbursementTypeFormReturn = useForm<ReimbursementFormType>({
    resolver: useMemo(() => {
      if (activeStep === 0) {
        return zodResolver(ReimbursementTypeSchema);
      }
    }, [activeStep]),
    defaultValues: useMemo(() => {
      if (reimbursementFormValues.request_type) {
        return {
          request_type: reimbursementFormValues.request_type,
        };
      }
    }, [reimbursementFormValues]),
    mode: "onChange",
  });

  /***Closes the form and open cancel dialog */
  const handleOpenCancelDialog = () => {
    const selectedReimbursementType =
      useReimbursementTypeFormReturn.getValues("request_type");
    dispatch(toggleFormDialog());

    if (selectedReimbursementType) {
      dispatch(toggleCancelDialog());
    }
  };

  /**Continue reimbursement request cancellation */
  const handleConfirmCancellation = () => {
    dispatch(clearReimbursementForm());
    useReimbursementTypeFormReturn.reset();
    dispatch(toggleCancelDialog());
  };

  /**Aborts reimbursement request cancellation */
  const handleAbortCancellation = () => {
    dispatch(toggleCancelDialog());
    dispatch(
      appApiSlice.util.invalidateTags([
        {
          type: "ExpenseTypes",
          id: useReimbursementTypeFormReturn.getValues("request_type"),
        },
      ]),
    );
    dispatch(toggleFormDialog());
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const searchValue = e.target.value;
    setSearchParams({ ...searchParams, search: searchValue });
  };

  const {
    isVisible: confirmReportDownloadIsOpen,
    open: openReportConfirmDialog,
    close: closeReportConfirmDialog,
  } = useDialogState();

  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      dispatch(setSelectedItems([]));
      dispatch(
        appApiSlice.util.invalidateTags([
          { type: "ReimbursementApprovalList" },
        ]),
      );
      dispatch(appApiSlice.util.invalidateTags([{ type: "FinanceAnalytics" }]));
      dispatch(setSelectedItems([]));
      setDownloadReportLoading(false);
      closeReportConfirmDialog();
    },
    onError: () => {
      showToast({
        type: "error",
        description: "Error downloading.Please try again.",
      });
      setDownloadReportLoading(false);
      closeReportConfirmDialog();
    },
  });

  const downloadReport = async () => {
    setDownloadReportLoading(true);
    await exportReport(
      `${
        env.NEXT_PUBLIC_BASEAPI_URL
      }/api/finance/reimbursements/requests/reports/finance?reimbursement_request_ids=${JSON.stringify(
        selectedItems,
      )}`,
    );
  };

  return (
    <>
      <div className="grid bg-neutral-50 md:gap-y-4 lg:p-5">
        <AdminAnalytics />
        <div className="flex flex-col justify-between gap-2 p-4 md:flex-row lg:p-0">
          <h4>Reimbursements</h4>

          {!isSearching && isFetching ? (
            <SkeletonLoading className="h-10 w-full rounded-sm md:w-64" />
          ) : (
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <Input
                name="inputText"
                placeholder="Find anything..."
                loading={isFetching}
                icon={AiOutlineSearch as IconType}
                onChange={handleSearch}
              />

              <CollapseWidthAnimation
                isVisible={data && data.results.length > 0 ? true : false}
              >
                <Button
                  variant="success"
                  className="whitespace-nowrap"
                  onClick={openReportConfirmDialog}
                >
                  Download Report
                </Button>
              </CollapseWidthAnimation>
            </div>
          )}
        </div>

        <Table
          type="admin"
          loading={isFetching}
          data={data?.results}
          columns={columns}
          handleMobileClick={(e: number) => {
            setFocusedReimbursementId(e);
            open();
          }}
          tableState={{
            filters,
            selectedItems,
          }}
          tableStateActions={{
            setSelectedItems: setSelectedItemsState,
          }}
          pagination={{
            count: data?.count!,
            next: data?.next!,
            previous: data?.previous!,
          }}
        />
      </div>

      <Dialog
        title={
          activeStep === 0
            ? "Reimbursement Type"
            : activeStep === 1 && !particularDetailsFormIsVisible
              ? "Add Particulars"
              : activeStep === 1 && particularDetailsFormIsVisible
                ? "Particular"
                : activeStep === 2 && !selectedAttachmentMethod
                  ? "File a Reimbursements"
                  : activeStep === 2 && selectedAttachmentMethod === "capture"
                    ? "Take Photo"
                    : "Upload Files"
        }
        isVisible={formDialogIsOpen}
        close={handleOpenCancelDialog}
        hideCloseIcon
      >
        <ReimburseForm
          formReturn={useReimbursementTypeFormReturn}
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
          !focusedReimbursementDataIsFetching && focusedReimbursementData
            ? focusedReimbursementData.reference_no
            : focusedReimbursementDataIsError
              ? "Error"
              : "..."
        }
        isVisible={isVisible}
        closeDrawer={close}
      >
        <ReimbursementsCardView
          closeDrawer={close}
          isLoading={focusedReimbursementDataIsFetching}
          isError={focusedReimbursementDataIsError}
          data={focusedReimbursementData}
          setFocusedReimbursementId={setFocusedReimbursementId}
        />
      </SideDrawer>

      <Dialog
        title="Download Report"
        isVisible={confirmReportDownloadIsOpen}
        close={closeReportConfirmDialog}
        hideCloseIcon
      >
        <div className="flex flex-col gap-8 pt-8">
          {selectedItems.length === 0 && (
            <p className="text-neutral-800">
              Downloading the report will change the reimbursements status to
              processing. Are you sure you want to download <strong>all</strong>{" "}
              reimbursements?
            </p>
          )}

          {selectedItems.length === 1 && (
            <p className="text-neutral-800">
              Downloading the report will change the reimbursements status to
              processing. Are you sure you want to download{" "}
              <strong>
                {
                  data?.results.find((a) => a.id === selectedItems[0])
                    ?.reimb_requestor.first_name
                }{" "}
                {
                  data?.results.find((a) => a.id === selectedItems[0])
                    ?.reimb_requestor.last_name
                }
                ,{" "}
                {
                  data?.results.find((a) => a.id === selectedItems[0])
                    ?.reference_no
                }
              </strong>{" "}
              reimbursements?
            </p>
          )}

          {selectedItems.length > 1 && (
            <p className="text-neutral-800">
              Downloading the report will change the reimbursements status to
              processing. Are you sure you want to download{" "}
              <strong>{selectedItems.length}</strong> reimbursements?
            </p>
          )}

          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={closeReportConfirmDialog}
            >
              No
            </Button>
            <Button
              loading={downloadReportLoading}
              disabled={downloadReportLoading}
              variant="success"
              className="w-1/2"
              onClick={() => void downloadReport()}
            >
              Yes, Download
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default MyAdmin;
