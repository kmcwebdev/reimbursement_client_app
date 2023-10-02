/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, type ChangeEvent } from "react";

import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
// import axios, { type AxiosResponse } from "axios";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { env } from "~/env.mjs";
import { setSelectedItems } from "~/features/page-state.slice";
import {
  useGetAllApprovalQuery,
  useGetRequestQuery,
} from "~/features/reimbursement-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
  type IReimbursementsFilterQuery,
  type ReimbursementApproval,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { useDebounce } from "~/utils/useDebounce";
import CollapseWidthAnimation from "../animation/CollapseWidth";
import { Button } from "../core/Button";
import Dialog from "../core/Dialog";
import SideDrawer from "../core/SideDrawer";
import SkeletonLoading from "../core/SkeletonLoading";
import StatusBadge, { type StatusType } from "../core/StatusBadge";
import Input from "../core/form/fields/Input";
import Table from "../core/table";
import TableCheckbox from "../core/table/TableCheckbox";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";
import ExpenseTypeFilter from "../core/table/filters/ExpenseTypeFilter";
import StatusFilter, {
  type FilterProps,
} from "../core/table/filters/StatusFilter";
import ReimbursementsCardView from "../reimbursement-view";
import FinanceAnalytics from "./analytics/FinanceAnalytics";
import { appApiSlice } from "~/app/rtkQuery";

const ReimbursementTypeFilter = dynamic(
  () => import("../core/table/filters/ReimbursementTypeFilter"),
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
    useState<string>();

  const {
    isFetching: reimbursementRequestDataIsLoading,
    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { reimbursement_request_id: focusedReimbursementId! },
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

  const { accessToken } = useAppSelector((state) => state.session);

  const downloadReport = () => {
    setDownloadReportLoading(true)
    // REMOVE THIS IF FETCH METHOD IS THE FINAL USAGE FOR DOWNLOAD
    // const response = await axios.get<unknown, AxiosResponse<Blob>>(
    //   `${env.NEXT_PUBLIC_BASEAPI_URL}/api/finance/reimbursements/requests/reports/finance`,
    //   {
    //     responseType: "blob", // Important to set this
    //     headers: {
    //       accept: "*/*",
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //     params: { reimbursement_request_ids: JSON.stringify(selectedItems) },
    //   },
    // );

    // const url = window.URL.createObjectURL(new Blob([response.data]));
    // const link = document.createElement("a");
    // link.href = url;
    // link.setAttribute("download", "filename.csv");
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
    };
    
    fetch(`${env.NEXT_PUBLIC_BASEAPI_URL}/api/finance/reimbursements/requests/reports/finance?reimbursement_request_ids=${ JSON.stringify(selectedItems)}`, options)
      .then(response => response.blob())
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'csv' }));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `filename.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        dispatch(appApiSlice.util.invalidateTags([{type: "ReimbursementApprovalList"}]));
        dispatch(appApiSlice.util.invalidateTags([{type: "FinanceAnalytics"}]));
        setDownloadReportLoading(false)
        closeReportConfirmDialog();
      })
      .catch(err => console.error(err)
    ); 
  };

  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: string[]) => {
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

  const columns = React.useMemo<ColumnDef<ReimbursementApproval>[]>(
    () => [
      {
        id: "select",
        size: 40,
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
        size: 220,
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
        header: "Approved",
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
              setFocusedReimbursementId(info.getValue() as string);
              openReimbursementView();
              console.log(info);
            }}
          >
            View
          </Button>
        ),
        header: "",
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
      <div className="grid gap-y-4 bg-neutral-50 p-5">
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
        <div className="flex flex-col justify-between gap-2 md:flex-row">
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
                isVisible={data && data.length > 0 ? true : false}
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

        {/* <CollapseWidthAnimation
          isVisible={data && data.length > 0 ? true : false}
        >
          <div className="w-52">
            <ButtonGroup
              handleChange={(e) => console.log(e)}
              label=""
              name=""
              options={[
                { label: "Pending", value: "Pending" },
                { label: "On-Hold", value: "On-Hold" },
              ]}
            />
          </div>
        </CollapseWidthAnimation> */}

        <Table
          type="approvals"
          loading={isFetching}
          data={data}
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

                <strong>all</strong>{" "}
                reimbursements?

              </p>
            )}

            {selectedItems.length === 1 && (
              <p className="text-neutral-800">
                Downloading the report will change the reimbursements status to
                processing. Are you sure you want to download{" "}
                <strong>
                  {
                    data?.find(
                      (a) => a.reimbursement_request_id === selectedItems[0],
                    )?.full_name
                  }
                  ,{" "}
                  {
                    data?.find(
                      (a) => a.reimbursement_request_id === selectedItems[0],
                    )?.reference_no
                  }
                </strong>{" "}
                reimbursements?
              </p>
            )}

            {selectedItems.length > 1 && (
              <p className="text-neutral-800">
                Downloading the report will change the reimbursements status to
                processing. Are you sure you want to download{" "}
                <strong>{selectedItems.length}</strong>{" "}
                reimbursements?
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
