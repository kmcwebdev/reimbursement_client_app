/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { useApprovalAnalyticsQuery } from "~/features/api/analytics-api-slice";
import {
  useGetApprovalListQuery,
  useGetRequestQuery,
} from "~/features/api/reimbursement-api-slice";
import {
  openSideDrawer,
  setFocusedReimbursementId,
  setPageTableFilters,
  setSelectedItems,
  toggleBulkCreditDialog,
  toggleBulkDownloadReportDialog,
} from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import { useReportDownload } from "~/hooks/use-report-download";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";
import { env } from "../../../../env.mjs";
import { showToast } from "../core/Toast";
import { type ButtonGroupOption } from "../core/form/fields/ButtonGroup";
import Table from "../core/table";
import TableCell from "../core/table/TableCell";
import TableCheckbox from "../core/table/TableCheckbox";
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
  () => import("../core/table/filters/ReimbursementTypeFilter"),
);

const ExpenseTypeFilter = dynamic(
  () => import("../core/table/filters/ExpenseTypeFilter"),
);
const DateFiledFilter = dynamic(
  () => import("../core/table/filters/DateFiledFilter"),
);

const Payables: React.FC = () => {
  const { assignedRole } = useAppSelector((state) => state.session);
  const { selectedItems, filters, focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );

  const [searchParams, setSearchParams] = useState<IReimbursementsFilterQuery>({
    search: undefined,
    expense_type__id: undefined,
    request_type__id: undefined,
    created_at_before: undefined,
    created_at_after: undefined,
  });

  const [downloadReportLoading, setDownloadReportLoading] = useState(false);
  const debouncedSearchText = useDebounce(searchParams.search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [selectedStatusValue, setSelectedStatusValue] = useState<number>(1);

  useMemo(() => {
    setSelectedStatusValue(1);
  }, []);

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

  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      dispatch(setSelectedItems([]));
      dispatch(
        appApiSlice.util.invalidateTags([
          "ReimbursementRequest",
          "ReimbursementApprovalList",
          "ApprovalAnalytics",
        ]),
      );
      dispatch(setSelectedItems([]));
      setDownloadReportLoading(false);
      toggleDownloadReportDialogVisibility();
    },
    onError: (data) => {
      showToast({
        type: "error",
        description: data
          ? (data as string)
          : "Error downloading.Please try again.",
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

    const searchParams = createSearchParams(filters);
    if (reference_nos.length > 0) {
      searchParams?.append("multi_reference_no", reference_nos.join(","));
    }

    // if (reference_nos.length === 0) {
    //   searchParams?.append("process_all_request","true")
    // }

    searchParams?.append("ordering", "-created_at");

    let filename: string = "FINANCE_REIMBURSEMENT_REPORT";

    if (reference_nos.length === 1) {
      const requestor = data?.results.find(
        (b) => reference_nos[0] === b.reference_no,
      )?.reimb_requestor;

      filename = `${filename} (${requestor?.first_name.toUpperCase()} ${requestor?.last_name.toUpperCase()}-${reference_nos[0]})`;
    }

    if (reference_nos.length > 1) {
      filename = `${filename} - ${reference_nos.join(",")}`;
    }

    const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/finance/download-reports${searchParams && searchParams.size ? `?${searchParams.toString()}` : ""}`;

    await exportReport(url, filename);
    dispatch(
      appApiSlice.util.invalidateTags([
        "ReimbursementRequest",
        "ReimbursementApprovalList",
        "ApprovalAnalytics",
      ]),
    );
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
    },
  );

  const { isFetching: analyticsIsLoading, data: analytics } =
    useApprovalAnalyticsQuery(
      {
        type: assignedRole?.split("_")[1].toLowerCase()!,
      },
      { skip: !assignedRole },
    );

  const columns = React.useMemo<ColumnDef<IReimbursementRequest>[]>(
    () => {
      const defaultColumns: ColumnDef<IReimbursementRequest>[] = [
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
          id: "approver_matrix",
          accessorKey: "approver_matrix",
          header: "Approved",
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

  useEffect(() => {
    if (selectedStatusValue) {
      dispatch(setSelectedItems([]));
      dispatch(
        setPageTableFilters({
          ...filters,
          request_status__id: selectedStatusValue.toString(),
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatusValue]);

  const handleStatusToggleChange = (e: ButtonGroupOption) => {
    setSelectedStatusValue(+e.value);
  };

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

        <Table
          header={{
            isLoading: !isSearching && isFetching,
            title:
              selectedStatusValue === 3
                ? "For Crediting"
                : selectedStatusValue === 5
                  ? "Onhold"
                  : "For Processing",
            button: selectedStatusValue === 3 ? "credit" : "download",
            buttonClickHandler:
              selectedStatusValue === 3
                ? toggleCreditDialogVisibility
                : toggleDownloadReportDialogVisibility,
            buttonIsVisible: data && data.results.length > 0 ? true : false,
            handleSearch: handleSearch,
            searchIsLoading: isFetching,
            handleStatusToggle: handleStatusToggleChange,
            statusToggleValue: selectedStatusValue,
          }}
          type="finance"
          loading={isFetching}
          handleMobileClick={(e: number) => {
            dispatch(setFocusedReimbursementId(e));
            dispatch(openSideDrawer());
          }}
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
        />

        <BulkTransitionToCreditedDialog
          selectedReimbursement={data?.results.find(
            (a) => a.id === selectedItems[0],
          )}
        />
      </div>
    </>
  );
};

export default Payables;
