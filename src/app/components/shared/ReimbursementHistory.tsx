/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

"use client";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React, { useEffect, useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { env } from "~/env.mjs";
import {
  useGetRequestQuery,
  useGetRequestsHistoryQuery,
} from "~/features/api/reimbursement-api-slice";
import {
  setHistoryDashboardFilters,
  setHistoryDashboardSelectedItems,
} from "~/features/state/history-dashboard-state-slice";
import { toggleBulkDownloadReportDialog } from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import { useReportDownload } from "~/hooks/use-report-download";
import {
  type QueryFilter,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";
import { showToast } from "../core/Toast";
import TableV2 from "../core/tableV2";
import TableCell from "../core/tableV2/TableCell";
import TableCheckbox from "../core/tableV2/TableCheckbox";

const ReimbursementsCardView = dynamic(() => import("../reimbursement-view"));
const BulkDownloadReportDialog = dynamic(
  () => import("./dialogs/download-report/BulkDownloadReportDialog"),
);
const StatusFilter = dynamic(
  () => import("~/app/components/core/tableV2/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("~/app/components/core/tableV2/filters/ExpenseTypeFilter"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("~/app/components/core/tableV2/filters/ReimbursementTypeFilter"),
);

const DateFiledFilter = dynamic(
  () => import("~/app/components/core/tableV2/filters/DateFiledFilter"),
);

const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));

const ReimbursementHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, assignedRole } = useAppSelector((state) => state.session);
  const [downloadReportLoading, setDownloadReportLoading] = useState(false);

  const { focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );

  const { selectedItems, filters } = useAppSelector(
    (state) => state.historyDashboardState,
  );

  const {
    isFetching: reimbursementRequestDataIsLoading,
    isError: reimbursementRequestDataIsError,
    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const [searchParams, setSearchParams] = useState<QueryFilter | null>(null);

  const toggleDownloadReportDialogVisibility = () => {
    dispatch(toggleBulkDownloadReportDialog());
  };

  const debouncedSearchText = useDebounce(searchParams?.search, 500);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      dispatch(setHistoryDashboardSelectedItems([]));
      setDownloadReportLoading(false);
      toggleDownloadReportDialogVisibility();
    },
    onError: (error) => {
      showToast({
        type: "error",
        description: error,
      });
      setDownloadReportLoading(false);
      toggleDownloadReportDialogVisibility();
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

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(() => {
    //FINANCE COLUMNS
    const defaultColumns: ColumnDef<ReimbursementRequest>[] = [
      {
        id: "select",
        header: ({ table }) => {
          if (table.getRowModel().rows.length > 0) {
            return (
              <TableCheckbox
                id="HistoryHeaderCheckbox"
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
            id={row.original.id.toString()}
            checked={row.getIsSelected()}
            tableHasChecked={selectedItems.length > 0}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        id:
          assignedRole === "REIMBURSEMENT_FINANCE"
            ? "request_status"
            : "approver_matrix",
        accessorKey:
          assignedRole === "REIMBURSEMENT_FINANCE"
            ? "request_status"
            : "approver_matrix",
        header: "Status",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: () => (
            <StatusFilter filters={filters} setFilters={setFilters} />
          ),
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
          filterComponent: () => (
            <ReimbursementTypeFilter
              filters={filters}
              setFilters={setFilters}
            />
          ),
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
          filterComponent: () => (
            <ExpenseTypeFilter filters={filters} setFilters={setFilters} />
          ),
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
          filterComponent: () => (
            <DateFiledFilter filters={filters} setFilters={setFilters} />
          ),
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

    const searchParams = createSearchParams(filters ? filters : {});
    if (reference_nos.length > 0) {
      searchParams?.append("multi_reference_no", reference_nos.join(","));
    }
    searchParams?.append("ordering", "-created_at");

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

    const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/${assignedRole?.split("_")[1].toLowerCase()}/download-reports/history${searchParams && searchParams.size ? `?${searchParams.toString()}` : ""}`;

    await exportReport(url, filename);
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

  const setFilters = (filters: QueryFilter | null) => {
    dispatch(setHistoryDashboardFilters(filters));
  };

  const setSelectedItems = (selectedItems: number[]) => {
    dispatch(setHistoryDashboardSelectedItems(selectedItems));
  };

  const resetTableState = () => {
    dispatch(setHistoryDashboardFilters(null));
    dispatch(setHistoryDashboardSelectedItems([]));
  };

  if (assignedRole === "REIMBURSEMENT_USER") {
    redirect("/forbidden");
  }

  return (
    <>
      <div className="grid bg-neutral-50 md:gap-y-4 md:p-5">
        <TableV2
          tableState={{ filters, selectedItems }}
          tableActions={{ setSelectedItems, resetTableState, setFilters }}
          header={{
            isLoading: !isSearching && isFetching,
            title: "Reimbursements History",
            button: "download",
            buttonClickHandler: toggleDownloadReportDialogVisibility,
            buttonIsVisible: data && data.results.length > 0 ? true : false,
            handleSearch: handleSearch,
            searchIsLoading: isFetching,
          }}
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
      >
        <ReimbursementsCardView
          isLoading={reimbursementRequestDataIsLoading}
          isError={reimbursementRequestDataIsError}
          data={reimbursementRequestData}
        />
      </SideDrawer>

      <BulkDownloadReportDialog
        isLoading={downloadReportLoading}
        downloadType="report-only"
        onConfirm={() => void downloadReport()}
        selectedReimbursement={data?.results.find(
          (a) => a.id === selectedItems[0],
        )}
        selectedItems={selectedItems}
      />
    </>
  );
};

export default ReimbursementHistory;
