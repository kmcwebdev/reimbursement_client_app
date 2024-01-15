/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type ChangeEvent } from "react";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { MdDownload } from "react-icons-all-files/md/MdDownload";
import { Button } from "~/app/components/core/Button";
import StatusBadge, {
  type StatusType,
} from "~/app/components/core/StatusBadge";
import Table from "~/app/components/core/table";
import { type FilterProps } from "~/app/components/core/table/filters/StatusFilter";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  useGetAllRequestsQuery,
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
import { currencyFormat } from "~/utils/currencyFormat";
import { env } from "../../../../env.mjs";
import CollapseWidthAnimation from "../animation/CollapseWidth";
import SkeletonLoading from "../core/SkeletonLoading";
import { showToast } from "../core/Toast";
import Input from "../core/form/fields/Input";
import TableCheckbox from "../core/table/TableCheckbox";
import ReimbursementsCardView from "../reimbursement-view";

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

const MyReimbursements: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.session);
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
    text_search: undefined,
    expense_type_ids: undefined,
    from: undefined,
    to: undefined,
  });

  const {
    isVisible: downloadConfirmationIsOpen,
    open: openDownloadConfirmation,
    close: closeDownloadConfirmation,
  } = useDialogState();

  const debouncedSearchText = useDebounce(searchParams.text_search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      dispatch(setSelectedItems([]));
      setDownloadReportLoading(false);
      closeDownloadConfirmation();
    },
    onError: () => {
      showToast({
        type: "error",
        description: "Error downloading.Please try again.",
      });
      setDownloadReportLoading(false);
      closeDownloadConfirmation();
    },
  });

  const setSelectedItemsState = (value: number[]) => {
    dispatch(setSelectedItems(value));
  };

  const { isFetching, data } = useGetAllRequestsQuery({
    ...filters,
    text_search: debouncedSearchText,
    history: true,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
        id: `${
          user?.groups[0] === "REIMBURSEMENT_FINANCE"
            ? "finance_request_status"
            : user?.groups[0] === "REIMBURSEMENT_HRBP"
              ? "hrbp_request_status"
              : "requestor_request_status"
        }`,
        accessorKey: `${
          user?.groups[0] === "REIMBURSEMENT_FINANCE"
            ? "finance_request_status"
            : user?.groups[0] === "REIMBURSEMENT_HRBP"
              ? "hrbp_request_status"
              : "requestor_request_status"
        }`,
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
        id: "client_name",
        accessorKey: "client_name",
        cell: (info) => info.getValue(),
        header: "Client",
      },
      {
        id: "employee_id",
        accessorKey: "employee_id",
        cell: (info) => info.getValue(),
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
        header: `${
          user?.groups[0] === "REIMBURSEMENT_FINANCE" ? "Approved" : "Filed"
        }`,

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
              setFocusedReimbursementId(info.getValue() as number);
              open();
            }}
          >
            View
          </Button>
        ),
        header: "",
      },
    ];

    if (user?.groups[0] === "REIMBURSEMENT_MANAGER") {
      return defaultColumns.filter((a) => a.id !== "select");
    }

    return defaultColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, user?.groups[0]]);

  const downloadReport = async () => {
    setDownloadReportLoading(true);

    if (user?.groups[0] === "REIMBURSEMENT_FINANCE") {
      await exportReport(
        `${
          env.NEXT_PUBLIC_BASEAPI_URL
        }/api/finance/reimbursements/requests/reports/finance?reimbursement_request_ids=${JSON.stringify(
          selectedItems,
        )}`,
      );
    }

    if (user?.groups[0] === "REIMBURSEMENT_HRBP") {
      await exportReport(
        `${
          env.NEXT_PUBLIC_BASEAPI_URL
        }/api/finance/reimbursements/requests/reports/hrbp?reimbursement_request_ids=${JSON.stringify(
          selectedItems,
        )}`,
      );
    }
  };

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
        <div className="flex flex-col justify-between gap-2 p-4 md:flex-row lg:p-0">
          <div className="flex items-center justify-between">
            <h4>Reimbursements History</h4>

            <div className="flex md:hidden">
              {!isSearching && isFetching ? (
                <SkeletonLoading className="h-5 w-5 rounded-full" />
              ) : (
                <>
                  {user &&
                    (user.groups[0] === "REIMBURSEMENT_FINANCE" ||
                      user.groups[0] === "REIMBURSEMENT_HRBP") && (
                      <CollapseWidthAnimation
                        isVisible={data && data.length > 0 ? true : false}
                      >
                        <MdDownload
                          onClick={openDownloadConfirmation}
                          className="h-5 w-5 rounded-full border border-green-600 p-0.5 text-green-600"
                        />
                      </CollapseWidthAnimation>
                    )}
                </>
              )}
            </div>
          </div>

          {!isSearching && isFetching ? (
            <div className="flex gap-2">
              <SkeletonLoading className="h-10 w-full rounded-sm md:w-64" />
              <SkeletonLoading className="h-10 w-full rounded-sm md:w-40" />
            </div>
          ) : (
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <Input
                name="inputText"
                placeholder="Find anything..."
                className="w-full md:w-64"
                loading={isSearching && isFetching}
                icon={AiOutlineSearch as IconType}
                onChange={handleSearch}
              />

              {user &&
                (user.groups[0] === "REIMBURSEMENT_FINANCE" ||
                  user.groups[0] === "REIMBURSEMENT_HRBP") && (
                  <CollapseWidthAnimation
                    isVisible={data && data.length > 0 ? true : false}
                  >
                    <Button
                      variant="success"
                      className="hidden whitespace-nowrap md:flex"
                      onClick={openDownloadConfirmation}
                    >
                      Download Report
                    </Button>
                  </CollapseWidthAnimation>
                )}
            </div>
          )}
        </div>

        <Table
          type="history"
          loading={isFetching}
          data={data}
          columns={columns}
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
                  data?.find((a) => a.id === selectedItems[0])?.reimb_requestor
                    .first_name
                }{" "}
                {
                  data?.find((a) => a.id === selectedItems[0])?.reimb_requestor
                    .last_name
                }
                , {data?.find((a) => a.id === selectedItems[0])?.reference_no}
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

export default MyReimbursements;
