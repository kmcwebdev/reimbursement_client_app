/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

"use client";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "~/app/components/core/Button";
import Table from "~/app/components/core/table";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  useGetRequestQuery,
  useGetRequestsHistoryQuery,
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
import TableHeaderTitle from "../core/table/TableHeaderTitle";

const ReimbursementsCardView = dynamic(() => import("../reimbursement-view"));
const Dialog = dynamic(() => import("~/app/components/core/Dialog"));
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

const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));

const ReimbursementHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, assignedRole } = useAppSelector((state) => state.session);
  const [downloadReportLoading, setDownloadReportLoading] = useState(false);

  const { isVisible, open, close } = useDialogState();
  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<number>();

  const { selectedItems, filters } = useAppSelector(
    (state) => state.pageTableState,
  );

  const {
    isFetching: reimbursementRequestDataIsLoading,
    isError: reimbursementRequestDataIsError,
    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const [searchParams, setSearchParams] = useState<IReimbursementsFilterQuery>({
    search: undefined,
    expense_type__id: undefined,
    created_at_before: undefined,
    created_at_after: undefined,
  });

  const {
    isVisible: downloadConfirmationIsOpen,
    open: openDownloadConfirmation,
    close: closeDownloadConfirmation,
  } = useDialogState();

  const debouncedSearchText = useDebounce(searchParams.search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      dispatch(setSelectedItems([]));
      setDownloadReportLoading(false);
      closeDownloadConfirmation();
    },
    onError: (data) => {
      showToast({
        type: "error",
        description: data
          ? (data as string)
          : "Error downloading.Please try again.",
      });
      setDownloadReportLoading(false);
      closeDownloadConfirmation();
    },
  });

  const { isFetching, currentData: data } = useGetRequestsHistoryQuery(
    {
      ...filters,
      search: debouncedSearchText,
      type: assignedRole?.split("_")[1].toLowerCase()!,
    },
    { skip: !assignedRole },
  );

  const columns = React.useMemo<ColumnDef<IReimbursementRequest>[]>(() => {
    //FINANCE COLUMNS
    const defaultColumns: ColumnDef<IReimbursementRequest>[] = [
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
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
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
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: ExpenseTypeFilter,
        },
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: `${
          user?.groups[0] === "REIMBURSEMENT_FINANCE" ? "Approved" : "Filed"
        }`,
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

    if (user?.groups[0] === "REIMBURSEMENT_MANAGER") {
      return defaultColumns.filter((a) => a.id !== "select");
    }

    return defaultColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, user?.groups[0]]);

  const downloadReport = async () => {
    setDownloadReportLoading(true);

    const reference_nos: string[] = [];
    selectedItems.forEach((a) => {
      const reimbursement = data?.results.find((b) => +a === b.id);
      if (reimbursement) {
        reference_nos.push(reimbursement.reference_no);
      }
    });

    let filename: string = `${assignedRole?.split("_")[1].toUpperCase()}_REIMBURSEMENT_HISTORY_REPORT`;

    if (reference_nos.length === 1) {
      const requestor = data?.results.find(
        (b) => reference_nos[0] === b.reference_no,
      )?.reimb_requestor;

      filename = `${filename} - ${requestor?.first_name.toUpperCase()} ${requestor?.last_name.toUpperCase()}-${reference_nos[0]}`;
    }

    if (reference_nos.length > 1) {
      filename = `${filename} - ${reference_nos.join(",")}`;
    }

    if (assignedRole === "REIMBURSEMENT_FINANCE") {
      const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/${assignedRole?.split("_")[1].toLowerCase()}/download-reports/history${reference_nos.length > 0 ? `?reference_no=${reference_nos.join(",")}` : ""}`;

      await exportReport(url, filename);
    } else {
      const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/${assignedRole?.split("_")[1].toLowerCase()}/download-reports${reference_nos.length > 0 ? `?reference_no=${reference_nos.join(",")}` : ""}`;

      await exportReport(url, filename);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const searchValue = e.target.value;
    setSearchParams({ ...searchParams, search: searchValue });
  };

  useEffect(() => {
    if (isSearching && !isFetching) {
      setIsSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return (
    <>
      <div className="grid bg-neutral-50 md:gap-y-4 md:p-5">
        <TableHeaderTitle
          title="Reimbursements History"
          isLoading={!isSearching && isFetching}
          searchIsLoading={isFetching}
          handleSearch={handleSearch}
          downloadReportButtonIsVisible={data && data.results.length > 0}
          hasDownloadReportButton
          handleDownloadReportButton={openDownloadConfirmation}
        />

        <Table
          type="history"
          loading={isFetching}
          data={data?.results}
          columns={columns}
          pagination={{
            count: data?.count!,
            next: data?.next!,
            previous: data?.previous!,
          }}
        />
      </div>

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

      <Dialog
        title="Download Report"
        isVisible={downloadConfirmationIsOpen}
        close={closeDownloadConfirmation}
        hideCloseIcon
      >
        <div className="flex flex-col gap-8 pt-8">
          {selectedItems && selectedItems.length === 1 && (
            <p className="text-neutral-800">
              Are you sure yo want to download{" "}
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
              reimbursement?
            </p>
          )}
          {selectedItems.length === 0 && (
            <p className="text-neutral-800">
              Are you sure yo want to download <strong>all</strong>{" "}
              reimbursements?
            </p>
          )}

          {selectedItems.length > 1 && (
            <p className="text-neutral-800">
              Are you sure yo want to download all{" "}
              <strong>{selectedItems.length}</strong> reimbursements?
            </p>
          )}

          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={closeDownloadConfirmation}
            >
              No
            </Button>
            <Button
              loading={downloadReportLoading}
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

export default ReimbursementHistory;
