/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, type ChangeEvent } from "react";

import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import {
  useGetAllApprovalQuery,
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
import { type FilterProps } from "../core/table/filters/StatusFilter";
import FinanceAnalytics from "./analytics/FinanceAnalytics";

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
  const { selectedItems, filters } = useAppSelector(
    (state) => state.pageTableState,
  );

  const [searchParams, setSearchParams] = useState<IReimbursementsFilterQuery>({
    text_search: undefined,
    expense_type_ids: undefined,
    reimbursement_type_id: undefined,
    from: undefined,
    to: undefined,
  });

  const [downloadReportLoading, setDownloadReportLoading] = useState(false);
  const debouncedSearchText = useDebounce(searchParams.text_search, 500);
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

  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: number[]) => {
    dispatch(setSelectedItems(value));
  };

  const { isFetching, data } = useGetAllApprovalQuery({
    ...filters,
    text_search: debouncedSearchText,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<IReimbursementRequest>[]>(
    () => [
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
        id: "finance_request_status",
        accessorKey: "finance_request_status",
        header: "Status",
        cell: TableCell,
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        meta: {
          filterComponent: (info: FilterProps) => <StatusFilter {...info} />,
        },
      },
      {
        id: "client_name",
        accessorKey: "client_name",
        cell: TableCell,
        header: "Client",
      },
      {
        id: "employee_id",
        accessorKey: "employee_id",
        cell: TableCell,
        header: "ID",
      },
      {
        id: "reimb_requestor",
        accessorKey: "reimb_requestor",
        cell: TableCell,
        header: "Name",
      },
      {
        id: "reference_no",
        accessorKey: "reference_no",
        cell: TableCell,
        header: "R-ID",
      },
      {
        id: "request_type",
        accessorKey: "request_type",
        cell: TableCell,
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
        cell: (info) => info.getValue(),
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
        cell: (info) => dayjs(info.getValue() as string).format("MMM D, YYYY"),
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
        cell: TableCell,
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "",
        cell: TableCell,
        setFocusedReimbursementId: setFocusedReimbursementId,
        openDrawer: openReimbursementView,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selectedItems],
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const searchValue = e.target.value;
    setSearchParams({ ...searchParams, text_search: searchValue });
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
        <FinanceAnalytics />

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
            pagination,
            selectedItems,
            filters,
          }}
          tableStateActions={{
            setSelectedItems: setSelectedItemsState,
            setPagination,
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
