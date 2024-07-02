/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { env } from "~/env.mjs";
import { useApprovalAnalyticsQuery } from "~/features/api/analytics-api-slice";
import {
  useGetApprovalListQuery,
  useGetRequestQuery,
} from "~/features/api/reimbursement-api-slice";
import {
  setFinanceDashboardFilters,
  setFinanceDashboardSelectedItems,
} from "~/features/state/finance-dashboard-state-slice";
import {
  toggleBulkCreditDialog,
  toggleBulkDownloadReportDialog,
} from "~/features/state/table-state.slice";
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
import ApprovalTableAnalytics from "./analytics/ApprovalTableAnalytics";

const ReimbursementsCardView = dynamic(() => import("../reimbursement-view"));
const SideDrawer = dynamic(() => import("../core/SideDrawer"));
const BulkDownloadReportDialog = dynamic(
  () => import("./dialogs/download-report/BulkDownloadReportDialog"),
);
const BulkTransitionToCreditedDialog = dynamic(
  () => import("./dialogs/update-to-credited/BulkTransitionToCreditedDialog"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("../core/tableV2/filters/ReimbursementTypeFilter"),
);

const ExpenseTypeFilter = dynamic(
  () => import("../core/tableV2/filters/ExpenseTypeFilter"),
);
const DateFiledFilter = dynamic(
  () => import("../core/tableV2/filters/DateFiledFilter"),
);

const Payables: React.FC = () => {
  const { assignedRole } = useAppSelector((state) => state.session);
  const { focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );

  const { filters, selectedItems } = useAppSelector(
    (state) => state.financeDashboardState,
  );

  const [searchParams, setSearchParams] = useState<QueryFilter | null>(null);

  const [downloadReportLoading, setDownloadReportLoading] = useState(false);
  const debouncedSearchText = useDebounce(searchParams?.search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const {
    isFetching: reimbursementRequestDataIsLoading,
    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const toggleDownloadReportDialogVisibility = () => {
    dispatch(toggleBulkDownloadReportDialog());
  };

  const dispatch = useAppDispatch();

  const { isFetching, data } = useGetApprovalListQuery(
    {
      ...filters,
      search: debouncedSearchText,
      type: assignedRole?.split("_")[1].toLowerCase()!,
    },
    {
      skip: !assignedRole,
      refetchOnMountOrArgChange: true,
    },
  );

  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      dispatch(
        appApiSlice.util.invalidateTags([
          "ReimbursementRequest",
          "ReimbursementApprovalList",
          "ApprovalAnalytics",
        ]),
      );
      dispatch(setFinanceDashboardSelectedItems([]));
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

    if (reference_nos.length === 0) {
      if (data) {
        const multi_reference_no = data.results
          .map((a) => a.reference_no)
          .join(",");
        searchParams?.append("multi_reference_no", multi_reference_no);
      }
    }

    searchParams?.append("ordering", "-created_at");

    const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/finance/download-reports${searchParams && searchParams.size ? `?${searchParams.toString()}` : ""}`;

    await exportReport(url);
  };

  const { isFetching: analyticsIsLoading, data: analytics } =
    useApprovalAnalyticsQuery(
      {
        type: assignedRole?.split("_")[1].toLowerCase()!,
      },
      { skip: !assignedRole },
    );

  const setFilters = (filters: QueryFilter | null) => {
    dispatch(setFinanceDashboardFilters(filters));
  };

  const setSelectedItems = (selectedItems: number[]) => {
    dispatch(setFinanceDashboardSelectedItems(selectedItems));
  };

  const resetTableState = () => {
    dispatch(setFinanceDashboardFilters(null));
    dispatch(setFinanceDashboardSelectedItems([]));
  };

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(
    () => {
      const defaultColumns: ColumnDef<ReimbursementRequest>[] = [
        {
          id: "select",
          header: ({ table }) => {
            if (table.getRowModel().rows.length > 0) {
              return (
                <TableCheckbox
                  id="table-header-checkbox"
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
              id={`checkbox-${row.original.id}`}
              checked={row.getIsSelected()}
              tableHasChecked={selectedItems.length > 0}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
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
          id: "approver_matrix",
          accessorKey: "approver_matrix",
          header: "Approved",
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

      return defaultColumns;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selectedItems],
  );

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

  const toggleCreditDialogVisibility = () => {
    dispatch(toggleBulkCreditDialog());
  };

  return (
    <>
      <div className="grid bg-neutral-50 md:gap-y-4 md:p-5">
        <ApprovalTableAnalytics
          type="finance"
          data={analytics!}
          isLoading={analyticsIsLoading}
        />

        <TableV2
          tableState={{ filters, selectedItems }}
          tableActions={{ resetTableState, setSelectedItems, setFilters }}
          header={{
            isLoading: !isSearching && isFetching,
            title:
              filters?.request_status__id === "3"
                ? "For Crediting"
                : filters?.request_status__id === "5"
                  ? "Onhold"
                  : "For Processing",
            button: filters?.request_status__id === "3" ? "credit" : "download",
            buttonClickHandler:
              filters?.request_status__id === "3"
                ? toggleCreditDialogVisibility
                : toggleDownloadReportDialogVisibility,
            buttonIsVisible: data && data.results.length > 0 ? true : false,
            handleSearch: handleSearch,
            searchIsLoading: isFetching,
          }}
          type="finance"
          loading={isFetching}
          data={data?.results}
          columns={columns}
          pagination={{
            count: data?.count!,
            next: data?.next!,
            previous: data?.previous!,
          }}
        />

        <SideDrawer
          title={
            !reimbursementRequestDataIsLoading && reimbursementRequestData
              ? reimbursementRequestData.reference_no
              : "..."
          }
        >
          <ReimbursementsCardView
            isLoading={reimbursementRequestDataIsLoading}
            data={reimbursementRequestData}
            isApproverView
          />
        </SideDrawer>

        <BulkDownloadReportDialog
          isLoading={downloadReportLoading}
          onConfirm={() => void downloadReport()}
          selectedReimbursement={data?.results.find(
            (a) => a.id === selectedItems[0],
          )}
          selectedItems={selectedItems}
        />

        <BulkTransitionToCreditedDialog
          selectedReimbursement={data?.results.find(
            (a) => a.id === selectedItems[0],
          )}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </>
  );
};

export default Payables;
