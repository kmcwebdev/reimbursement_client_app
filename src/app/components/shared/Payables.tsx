/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type ChangeEvent } from "react";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { useApprovalAnalyticsQuery } from "~/features/api/analytics-api-slice";
import {
  useGetApprovalListQuery,
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
import CollapseWidthAnimation from "../animation/CollapseWidth";
import { Button } from "../core/Button";
import SkeletonLoading from "../core/SkeletonLoading";
import { showToast } from "../core/Toast";
import Input from "../core/form/fields/Input";
import Table from "../core/table";
import TableCell from "../core/table/TableCell";
import TableCheckbox from "../core/table/TableCheckbox";
import ApprovalTableAnalytics from "./analytics/ApprovalTableAnalytics";

const ReimbursementsCardView = dynamic(() => import("../reimbursement-view"));
const SideDrawer = dynamic(() => import("../core/SideDrawer"));
const Dialog = dynamic(() => import("../core/Dialog"));
const ReimbursementTypeFilter = dynamic(
  () => import("../core/table/filters/ReimbursementTypeFilter"),
);
const StatusFilter = dynamic(
  () => import("../core/table/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("../core/table/filters/ExpenseTypeFilter"),
);
const DateFiledFilter = dynamic(
  () => import("../core/table/filters/DateFiledFilter"),
);

const Payables: React.FC = () => {
  const { assignedRole } = useAppSelector((state) => state.session);
  const { selectedItems, filters } = useAppSelector(
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
  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<number>();

  const {
    isFetching: reimbursementRequestDataIsLoading,
    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const {
    isVisible,
    open: openReimbursementView,
    close: closeReimbursementView,
  } = useDialogState();

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

    const reference_nos: string[] = [];
    selectedItems.forEach((a) => {
      const reimbursement = data?.results.find((b) => +a === b.id);
      if (reimbursement) {
        reference_nos.push(reimbursement.reference_no);
      }
    });

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

    const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/finance/download-reports${reference_nos.length > 0 ? `?multi_reference_no=${reference_nos.join(",")}` : ""}`;

    await exportReport(url, filename);
  };

  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: number[]) => {
    dispatch(setSelectedItems(value));
  };

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
          enableColumnFilter: true,
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
          setFocusedReimbursementId: setFocusedReimbursementId,
          openDrawer: openReimbursementView,
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

  return (
    <>
      <div className="grid bg-neutral-50 md:gap-y-4 lg:p-5">
        <ApprovalTableAnalytics
          type="finance"
          data={analytics!}
          isLoading={analyticsIsLoading}
        />

        <SideDrawer
          title={
            !reimbursementRequestDataIsLoading && reimbursementRequestData
              ? reimbursementRequestData.reference_no
              : "..."
          }
          isVisible={isVisible}
          closeDrawer={closeReimbursementView}
        >
          <ReimbursementsCardView
            closeDrawer={closeReimbursementView}
            isLoading={reimbursementRequestDataIsLoading}
            data={reimbursementRequestData}
            setFocusedReimbursementId={setFocusedReimbursementId}
            isApproverView
          />
        </SideDrawer>

        {/* table */}
        <div className="flex flex-col justify-between gap-2 p-4 md:flex-row lg:p-0">
          <h4>For Approvals</h4>

          {!isSearching && isFetching ? (
            <SkeletonLoading className="h-10 w-full rounded-sm md:w-64" />
          ) : (
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <Input
                name="inputText"
                placeholder="Find anything..."
                loading={isFetching && isSearching}
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
          type="approvals"
          loading={isFetching}
          data={data?.results}
          columns={columns}
          tableState={{
            selectedItems,
            filters,
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
                processing. Are you sure you want to download{" "}
                <strong>all</strong> reimbursements?
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
      </div>
    </>
  );
};

export default Payables;
