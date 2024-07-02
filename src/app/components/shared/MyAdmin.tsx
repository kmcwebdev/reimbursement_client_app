/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useState, type ChangeEvent } from "react";
import SideDrawerService from "~/app/api/services/side-drawer-service";
import TableService from "~/app/api/services/table-service";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { env } from "~/env.mjs";
import {
  setAdminDashboardFilters,
  setAdminDashboardSelectedItems,
} from "~/features/state/admin-dashboard-state-slice";
import { toggleBulkDownloadReportDialog } from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import { useReportDownload } from "~/hooks/use-report-download";
import {
  type QueryFilter,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { showToast } from "../core/Toast";
import TableV2 from "../core/tableV2";
import TableCell from "../core/tableV2/TableCell";
import TableCheckbox from "../core/tableV2/TableCheckbox";
import ClientFilter from "../core/tableV2/filters/ClientFilter";
import HRBPFilter from "../core/tableV2/filters/HRBPFilter";
import AdminAnalytics from "./analytics/AdminAnalytics";

const ReimbursementsCardView = dynamic(
  () => import("~/app/components/reimbursement-view"),
);
const BulkDownloadReportDialog = dynamic(
  () => import("./dialogs/download-report/BulkDownloadReportDialog"),
);
const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));

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

const MyAdmin: React.FC = () => {
  const { selectedItems, filters } = useAppSelector(
    (state) => state.adminDashboardState,
  );

  const { focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );
  const dispatch = useAppDispatch();

  const [downloadReportLoading, setDownloadReportLoading] = useState(false);

  const toggleDownloadReportDialogVisibility = () => {
    dispatch(toggleBulkDownloadReportDialog());
  };
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useState<QueryFilter | null>(null);

  const debouncedSearchText = useDebounce(searchParams?.search, 500);

  const {
    isFetching: focusedReimbursementDataIsFetching,
    isError: focusedReimbursementDataIsError,
    data: focusedReimbursementData,
  } = SideDrawerService.useReimbursementRequest(+focusedReimbursementId!);

  const { isFetching, data } = TableService.useAdminList({
    ...filters,
    search: debouncedSearchText,
  });

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(() => {
    const defaultColumns: ColumnDef<ReimbursementRequest, unknown>[] = [
      {
        id: "select",
        header: ({ table }) => {
          if (table.getRowModel().rows.length > 0) {
            return (
              <TableCheckbox
                id="MyAdminHeaderCheckbox"
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
        id: "request_status",
        accessorKey: "request_status",
        header: "Status",
        filterFn: (row, value: string) => {
          return value.includes(row.original.request_status.name);
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
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: () => (
            <ClientFilter filters={filters} setFilters={setFilters} />
          ),
        },
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
        id: "reimb_requestor",
        accessorKey: "reimb_requestor",
        header: "Assigned HRBP/s",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: () => (
            <HRBPFilter filters={filters} setFilters={setFilters} />
          ),
        },
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
          return value.includes(row.original.particulars[0].expense_type.name);
        },
        meta: {
          filterComponent: () => (
            <ExpenseTypeFilter filters={filters} setFilters={setFilters} />
          ),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const searchValue = e.target.value;
    setSearchParams({ ...searchParams, search: searchValue });
  };

  const setFilters = (filters: QueryFilter | null) => {
    dispatch(setAdminDashboardFilters(filters));
  };

  const setSelectedItems = (selectedItems: number[]) => {
    dispatch(setAdminDashboardSelectedItems(selectedItems));
  };

  const resetTableState = () => {
    dispatch(setAdminDashboardFilters(null));
    dispatch(setAdminDashboardSelectedItems([]));
  };

  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      resetTableState();
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

    const clientIdFilterValue = filters?.client_id;
    const hrbpIdFilterValue = filters?.hrbp_id;

    const reference_nos: string[] = [];
    const hrbp_ids: string[] = [];
    const client_ids: string[] = [];

    if (clientIdFilterValue) {
      const splittedValue = clientIdFilterValue.split(",");
      splittedValue.forEach((value) => client_ids.push(value));
    }

    if (hrbpIdFilterValue) {
      const splittedValue = hrbpIdFilterValue.split(",");
      splittedValue.forEach((value) => hrbp_ids.push(value));
    }

    selectedItems.forEach((a) => {
      const reimbursement = data?.results.find((b) => +a === b.id);
      if (reimbursement) {
        reference_nos.push(reimbursement.reference_no);
      }
    });

    const url = new URL(
      `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/administrator/download-reports`,
    );

    if (reference_nos.length > 0) {
      url.searchParams.append("multi_reference_no", client_ids.join(","));
    }

    if (client_ids.length > 0) {
      url.searchParams.append("client_id", client_ids.join(","));
    }

    if (hrbp_ids.length > 0) {
      url.searchParams.append("hrbp_id", hrbp_ids.join(","));
    }

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

    if (client_ids.length > 0) {
      filename = `${filename} - Client(${client_ids.join(",")})`;
    }

    if (hrbp_ids.length > 0) {
      filename = `${filename} - HRBP(${client_ids.join(",")})`;
    }

    await exportReport(url.href, filename);
  };

  return (
    <>
      <div className="relative flex flex-col bg-neutral-50 md:gap-y-4 md:p-5">
        <AdminAnalytics />

        <div className="relative flex-1">
          <TableV2
            tableState={{ filters, selectedItems }}
            tableActions={{ setSelectedItems, resetTableState, setFilters }}
            header={{
              isLoading: !isSearching && isFetching,
              title: "Reimbursements",
              button: "download",
              buttonClickHandler: toggleDownloadReportDialogVisibility,
              buttonIsVisible: data && data.results.length > 0 ? true : false,
              handleSearch: handleSearch,
              searchIsLoading: isFetching,
            }}
            type="admin"
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
      </div>

      <SideDrawer
        title={
          !focusedReimbursementDataIsFetching && focusedReimbursementData
            ? focusedReimbursementData.reference_no
            : focusedReimbursementDataIsError
              ? "Error"
              : "..."
        }
      >
        <ReimbursementsCardView
          isAdminView
          isLoading={focusedReimbursementDataIsFetching}
          isError={focusedReimbursementDataIsError}
          data={focusedReimbursementData}
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

export default MyAdmin;
