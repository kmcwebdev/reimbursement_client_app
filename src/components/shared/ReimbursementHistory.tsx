/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import axios, { type AxiosResponse } from "axios";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { Button } from "~/components/core/Button";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table from "~/components/core/table";
import { type FilterProps } from "~/components/core/table/filters/StatusFilter";
import { env } from "~/env.mjs";
import { useGetAllRequestsQuery } from "~/features/reimbursement-api-slice";
import {
  clearReimbursementForm,
  toggleCancelDialog,
  toggleFormDialog,
} from "~/features/reimbursement-form-slice";
import {
  setColumnFilters,
  setSelectedItems,
} from "~/features/reimbursement-request-page-slice";
import {
  ReimbursementDetailsSchema,
  type ReimbursementDetailsType,
} from "~/schema/reimbursement-details.schema";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import CollapseWidthAnimation from "../animation/CollapseWidth";
import SkeletonLoading from "../core/SkeletonLoading";
import Input from "../core/form/fields/Input";
import TableCheckbox from "../core/table/TableCheckbox";
import TableSkeleton from "../core/table/TableSkeleton";
import ClientFilter from "../core/table/filters/ClientFilter";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";

const Dialog = dynamic(() => import("~/components/core/Dialog"));
const ReimburseForm = dynamic(() => import("./reimburse-form"));

const StatusFilter = dynamic(
  () => import("~/components/core/table/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("~/components/core/table/filters/ExpenseTypeFilter"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("~/components/core/table/filters/ReimbursementTypeFilter"),
);

const MyReimbursements: React.FC = () => {
  const { user, accessToken } = useAppSelector((state) => state.session);

  const { formDialogIsOpen, cancelDialogIsOpen, reimbursementDetails } =
    useAppSelector((state) => state.reimbursementForm);

  const { selectedItems, columnFilters } = useAppSelector(
    (state) => state.reimbursementRequestPageState,
  );
  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: string[]) => {
    dispatch(setSelectedItems(value));
  };

  const setColumnFiltersState = (value: ColumnFiltersState) => {
    dispatch(setColumnFilters(value));
  };

  /**Uncomment if filter is already available on endpoint */
  // const [textSearch, setTextSearch] = useState<string>();
  // const debouncedSearchText = useDebounce(textSearch, 500);
  // const { isFetching, data } = useGetAllRequestsQuery(removeNull({text_search: debouncedSearchText}));

  // const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  //   const searchValue = e.target.value;
  //   setTextSearch(searchValue);
  // };

  const { isFetching, data } = useGetAllRequestsQuery({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(() => {
    return [
      {
        id: "select",
        size: 10,
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
          <div className="px-4">
            <TableCheckbox
              checked={row.getIsSelected()}
              tableHasChecked={selectedItems.length > 0}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      {
        id: "request_status",
        accessorKey: "request_status",
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
        size: 10,
        meta: {
          filterComponent: (info: FilterProps) => (
            <StatusFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
        },
      },
      {
        id: "client_name",
        accessorKey: "client_name",
        cell: (info) => info.getValue(),
        header: "Client",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => (
            <ClientFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
        },
      },
      {
        id: "ID",
        accessorKey: "ID",
        cell: (info) => info.getValue(),
        header: "ID",
        size: 20,
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
        size: 20,
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
            <ReimbursementTypeFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
        },
        size: 10,
      },
      {
        id: "expense_type",
        accessorKey: "expense_type",
        cell: (info) => info.getValue(),
        header: "Expense",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        size: 10,
        meta: {
          filterComponent: (info: FilterProps) => (
            <ExpenseTypeFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
        },
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        cell: (info) => dayjs(info.getValue() as string).format("MMM D, YYYY"),
        header: `${user?.assignedRole === "Finance" ? "Approved" : "Filed"}`,
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => (
            <DateFiledFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
        },
        size: 10,
      },
      {
        id: "amount",
        accessorKey: "amount",
        cell: (info) => currencyFormat(info.getValue() as number),
        header: "Total",
        size: 10,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadReport = async () => {
    const response = await axios.get<unknown, AxiosResponse<Blob>>(
      `${env.NEXT_PUBLIC_BASEAPI_URL}/api/finance/reimbursements/requests/reports/finance`,
      {
        responseType: "blob", // Important to set this
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filename.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //Form return for Details
  const useReimbursementDetailsFormReturn = useForm<ReimbursementDetailsType>({
    resolver: zodResolver(ReimbursementDetailsSchema),
    defaultValues: useMemo(() => {
      if (reimbursementDetails) {
        return { ...reimbursementDetails };
      }
    }, [reimbursementDetails]),
    mode: "onChange",
  });

  /***Closes the form and open cancel dialog */
  const handleOpenCancelDialog = () => {
    dispatch(toggleFormDialog());
    dispatch(toggleCancelDialog());
  };

  /**Continue reimbursement request cancellation */
  const handleConfirmCancellation = () => {
    dispatch(clearReimbursementForm());
    useReimbursementDetailsFormReturn.reset();
    dispatch(toggleCancelDialog());
  };

  /**Aborts reimbursement request cancellation */
  const handleAbortCancellation = () => {
    dispatch(toggleCancelDialog());
    dispatch(
      appApiSlice.util.invalidateTags([
        {
          type: "ExpenseTypes",
          id: useReimbursementDetailsFormReturn.getValues(
            "reimbursement_request_type_id",
          ),
        },
      ]),
    );
    dispatch(toggleFormDialog());
  };

  return (
    <>
      <div className="grid gap-y-2 p-5">
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <h4>Reimbursements History</h4>

          {isFetching && <SkeletonLoading className="h-10 w-[5rem] rounded" />}

          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <Input
              name="inputText"
              placeholder="Find anything..."
              icon={AiOutlineSearch as IconType}
              // onChange={handleSearch}
            />

            {user && user.assignedRole === "Finance" && (
              <CollapseWidthAnimation
                isVisible={data && data.length > 0 ? true : false}
              >
                <Button
                  variant="success"
                  className="whitespace-nowrap"
                  onClick={() => void downloadReport()}
                >
                  Download Report
                </Button>
              </CollapseWidthAnimation>
            )}
          </div>
        </div>

        {!isFetching && data && (
          <Table
            type="reimbursements"
            loading={isFetching}
            data={data}
            columns={columns}
            tableState={{
              pagination,
              selectedItems,
              columnFilters,
            }}
            tableStateActions={{
              setColumnFilters: setColumnFiltersState,
              setSelectedItems: setSelectedItemsState,
              setPagination,
            }}
          />
        )}

        {isFetching && <TableSkeleton />}
      </div>

      <Dialog
        title="File a Reimbursement"
        isVisible={formDialogIsOpen}
        close={handleOpenCancelDialog}
        hideCloseIcon
      >
        <ReimburseForm
          formReturn={useReimbursementDetailsFormReturn}
          handleOpenCancelDialog={handleOpenCancelDialog}
        />
      </Dialog>

      <Dialog
        title="Cancel Reimbursements?"
        isVisible={cancelDialogIsOpen}
        close={handleAbortCancellation}
        hideCloseIcon
      >
        <div className="flex flex-col gap-8 pt-8">
          <p className="text-neutral-800">
            Are you sure you want to cancel reimbursement request?
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={handleAbortCancellation}
            >
              No
            </Button>
            <Button
              variant="danger"
              className="w-1/2"
              onClick={handleConfirmCancellation}
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default MyReimbursements;
