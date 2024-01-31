/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useState, type ChangeEvent } from "react";
import { Button } from "~/app/components/core/Button";
import Table from "~/app/components/core/table";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import {
  useGetAdminListQuery,
  useGetRequestQuery,
} from "~/features/api/reimbursement-api-slice";
import { setSelectedItems } from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import { useDialogState } from "~/hooks/use-dialog-state";
import { useReportDownload } from "~/hooks/use-report-download";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
} from "~/types/reimbursement.types";
import { env } from "../../../../env.mjs";
import { showToast } from "../core/Toast";
import TableCell from "../core/table/TableCell";
import TableCheckbox from "../core/table/TableCheckbox";
import AdminAnalytics from "./analytics/AdminAnalytics";

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
  const { selectedItems, filters } = useAppSelector(
    (state) => state.pageTableState,
  );
  const dispatch = useAppDispatch();

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
        id: "select",
        header: ({ table }) => {
          if (table.getRowModel().rows.length > 0) {
            return (
              <TableCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                showOnHover={false}
              />
            );
          }
        },
        cell: ({ row }) => (
          <TableCheckbox
            checked={row.getIsSelected()}
            tableHasChecked={selectedItems.length > 0}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
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
        id: "reimb_requestor",
        accessorKey: "reimb_requestor",
        header: "Client",
      },
      {
        id: "reimb_requestor",
        accessorKey: "reimb_requestor",
        header: "E-ID",
      },
      {
        id: "reimb_requestor",
        accessorKey: "reimb_requestor",
        header: "Name",
      },
      {
        id: "reference_no",
        accessorKey: "reference_no",
        header: "R-ID",
      },
      {
        id: "request_type",
        accessorKey: "request_type",
        header: "Type",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
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
      a.cell = a.id === "select" ? a.cell : TableCell;
    });

    return defaultColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      dispatch(
        appApiSlice.util.invalidateTags([{ type: "ApprovalAnalytics" }]),
      );
      dispatch(setSelectedItems([]));
      setDownloadReportLoading(false);
      closeReportConfirmDialog();
    },
    onError: (data) => {
      showToast({
        type: "error",
        description: data
          ? (data as string)
          : "Error downloading.Please try again.",
      });
      setDownloadReportLoading(false);
      closeReportConfirmDialog();
    },
  });

  const downloadReport = async () => {
    setDownloadReportLoading(true);

    setDownloadReportLoading(true);

    const reference_nos: string[] = [];
    selectedItems.forEach((a) => {
      const reimbursement = data?.results.find((b) => +a === b.id);
      if (reimbursement) {
        reference_nos.push(reimbursement.reference_no);
      }
    });

    let filename: string = "ADMINISTRATOR_REIMBURSEMENT_REPORT";

    if (reference_nos.length === 1) {
      const requestor = data?.results.find(
        (b) => reference_nos[0] === b.reference_no,
      )?.reimb_requestor;

      filename = `${filename} (${requestor?.first_name.toUpperCase()} ${requestor?.last_name.toUpperCase()}-${reference_nos[0]})`;
    }

    if (reference_nos.length > 1) {
      filename = `${filename} - ${reference_nos.join(",")}`;
    }

    const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/administrator/download-reports${reference_nos.length > 0 ? `?multi_reference_no=${reference_nos.join(",")}` : ""}`;

    await exportReport(url, filename);
  };

  return (
    <>
      <div className="relative flex flex-col bg-neutral-50 md:gap-y-4 md:p-5">
        <AdminAnalytics />

        <div className="relative flex-1">
          <Table
            header={{
              isLoading: !isSearching && isFetching,
              title: "Reimbursements",
              button: "download",
              buttonClickHandler: openReportConfirmDialog,
              buttonIsVisible: data && data.results.length > 0 ? true : false,
              handleSearch: handleSearch,
              searchIsLoading: isFetching,
            }}
            type="admin"
            loading={isFetching}
            data={data?.results}
            columns={columns}
            handleMobileClick={(e: number) => {
              setFocusedReimbursementId(e);
              open();
            }}
            pagination={{
              count: data?.count!,
              next: data?.next!,
              previous: data?.previous!,
            }}
          />
        </div>
      </div>

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
              Are you sure you want to download <strong>all</strong>{" "}
              reimbursements?
            </p>
          )}

          {selectedItems.length === 1 && (
            <p className="text-neutral-800">
              Are you sure you want to download{" "}
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
              Are you sure you want to download{" "}
              <strong>{selectedItems.length}</strong> reimbursements?
            </p>
          )}

          <div className="flex items-center gap-4">
            <Button
              aria-label="No"
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={closeReportConfirmDialog}
            >
              No
            </Button>
            <Button
              aria-label="Yes,Download"
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
