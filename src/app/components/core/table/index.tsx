/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  useReactTable,
  type FilterMeta,
  type RowSelectionState,
  type Table,
} from "@tanstack/react-table";

import { FaSpinner } from "react-icons-all-files/fa/FaSpinner";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { resetPageTableState } from "~/features/state/table-state.slice";
import { type IResponsePagination } from "~/types/global-types";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { Button } from "../Button";
import FilterView from "./FilterView";
import MobileListItem from "./MobileListItem";
import Pagination, { PaginationSkeletonLoading } from "./Pagination";
import TableEmptyState from "./TableEmptyState";
import TableSkeleton from "./TableSkeleton";

export type ITableState = {
  filters: IReimbursementsFilterQuery;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems?: any;
};

export type ITableStateActions = {
  setSelectedItems?: (value: number[]) => void;
};

type ReimbursementTable = {
  type: "reimbursements";
  data?: IReimbursementRequest[];
};

type HistoryTable = {
  type: "history";
  data?: IReimbursementRequest[];
};

type ApprovalTable = {
  type: "approvals";
  data?: IReimbursementRequest[];
};

type FinanceTable = {
  type: "finance";
  data?: IReimbursementRequest[];
};

type AdminTable = {
  type: "admin";
  data?: IReimbursementRequest[];
};

type TableProps = {
  loading?: boolean;
  tableState?: ITableState;
  tableStateActions?: ITableStateActions;
  handleMobileClick?: (e: number) => void;
  pagination: IResponsePagination;
  columns: any;
} & (
  | ReimbursementTable
  | ApprovalTable
  | FinanceTable
  | HistoryTable
  | AdminTable
);

interface CustomFilterMeta extends FilterMeta {
  filterComponent: () => JSX.Element;
}

const Table: React.FC<TableProps> = (props) => {
  const { columns } = props;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.pageTableState);

  useEffect(() => {
    if (
      !props.loading &&
      rowSelection &&
      props.tableState &&
      props.tableStateActions &&
      props.tableState.selectedItems &&
      props.tableStateActions.setSelectedItems
    ) {
      const selectedItems: number[] = [];

      Object.keys(rowSelection).forEach((key) => {
        if (props.data) {
          selectedItems.push(props.data[key as unknown as number].id);
        }
      });
      props.tableStateActions?.setSelectedItems(selectedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  /** Resets the row selection state to its initial state/no selected record */
  useEffect(() => {
    const selected = props.tableState?.selectedItems;
    if (Array.isArray(selected) && selected.length === 0) {
      table.resetRowSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tableState?.selectedItems]);

  const table = useReactTable<IReimbursementRequest>({
    data: props.data!,
    columns,
    state: {
      ...props.tableState,
      rowSelection: props.tableState?.selectedItems ? rowSelection : undefined,
    },
    onRowSelectionChange: setRowSelection,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: props.tableStateActions?.setSelectedItems
      ? true
      : false,
    manualPagination: true,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  const handleClear = () => {
    dispatch(resetPageTableState());
    dispatch(appApiSlice.util.invalidateTags(["MyRequests"]));
    dispatch(appApiSlice.util.invalidateTags(["ReimbursementApprovalList"]));
    dispatch(appApiSlice.util.invalidateTags(["ReimbursementAdminList"]));
    dispatch(appApiSlice.util.invalidateTags(["ReimbursementHistoryList"]));
  };

  return (
    <div
      className={classNames(
        "flex h-[31.5rem] flex-col",
        props.loading
          ? "overflow-hidden"
          : "overflow-y-hidden md:overflow-x-auto",
      )}
    >
      <div
        className={classNames(
          "relative h-full w-full",
          props.loading
            ? "overflow-x-hidden overflow-y-hidden"
            : "overflow-y-auto overflow-x-hidden md:overflow-x-auto",
        )}
      >
        {/* TABLE HEADER */}
        <table className="relative w-full whitespace-nowrap">
          <thead className="sticky top-0 z-[5] hidden h-12 rounded-t-sm bg-white text-xs md:table-header-group">
            {props.loading && (
              <tr>
                <th colSpan={42} className="h-12 border-b">
                  <div className="flex gap-4 px-4 text-neutral-600">
                    <FaSpinner className="h-4 w-4 animate-spin" />
                    <p>Fetching table data...</p>
                  </div>
                </th>
              </tr>
            )}

            {!props.loading &&
              props.data &&
              table.getHeaderGroups().map((headerGroup, i) => (
                <tr key={i} className="h-12">
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <th
                        key={`header-${index}`}
                        colSpan={header.colSpan}
                        style={{
                          width:
                            header.getSize() === Number.MAX_SAFE_INTEGER
                              ? "auto"
                              : header.getSize(),
                        }}
                      >
                        <div className="flex items-center justify-between first:pl-4 last:pr-4">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          <div className="mt-1">
                            {header.column.columnDef?.meta &&
                              (
                                header.column.columnDef
                                  ?.meta as CustomFilterMeta
                              ).filterComponent &&
                              (
                                header.column.columnDef
                                  ?.meta as CustomFilterMeta
                              ).filterComponent()}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
          </thead>

          {/* MOBILE FILTERS */}
          <thead className="sticky top-0 z-[5] table-header-group h-12 rounded-t-sm  bg-white text-xs md:hidden">
            {props.loading && (
              <tr>
                <th colSpan={42} className="h-12 border-b">
                  <div className="flex gap-4 px-4 text-neutral-600">
                    <FaSpinner className="h-4 w-4 animate-spin" />
                    <p>Fetching table data...</p>
                  </div>
                </th>
              </tr>
            )}

            {!props.loading &&
              props.data &&
              table.getHeaderGroups().map((headerGroup, i) => (
                <tr key={i} className="h-12">
                  <th
                    colSpan={42}
                    className="flex h-12 items-center justify-between gap-2 border-b px-4"
                  >
                    <div className="flex h-full gap-2">
                      {headerGroup.headers
                        .filter(
                          (header) =>
                            header.column.columnDef?.meta &&
                            (header.column.columnDef?.meta as CustomFilterMeta)
                              .filterComponent,
                        )
                        .map((header, index) => {
                          return (
                            <div
                              key={`header-${index}`}
                              className="flex h-full items-center gap-2 text-xs"
                            >
                              <div
                                className={classNames(
                                  "flex items-center gap-1 rounded-sm bg-neutral-200 px-1",
                                )}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                <div className="mt-1">
                                  {header.column.columnDef?.meta &&
                                    (
                                      header.column.columnDef
                                        ?.meta as CustomFilterMeta
                                    ).filterComponent &&
                                    (
                                      header.column.columnDef
                                        ?.meta as CustomFilterMeta
                                    ).filterComponent()}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {Object.keys(filters).filter((a) => a !== "page").length >
                      0 && (
                      <Button
                        buttonType="text"
                        variant="danger"
                        onClick={handleClear}
                      >
                        <MdClose className="h-5 w-5" />
                      </Button>
                    )}
                  </th>
                </tr>
              ))}
          </thead>

          <tbody
            className={classNames(
              !props.loading && "shadow-sm",
              "relative h-full w-full rounded-b-sm bg-white p-4 md:border-none",
            )}
          >
            <FilterView colSpan={table.getAllColumns().length} />
            {props.loading && (
              <TableSkeleton length={table.getAllFlatColumns().length} />
            )}

            {/* {props.loading && <MobileListSkeleton />} */}
            {/* EMPTY STATE NO DATA */}
            {!props.loading &&
              props.data &&
              props.data.length === 0 &&
              table && <TableEmptyState type={props.type} colSpan={11} />}
            {/* EMPTY STATE NO FILTER RESULTS */}
            {!props.loading &&
              props.data &&
              props.data.length > 0 &&
              table &&
              table.getRowModel().rows.length === 0 && (
                <TableEmptyState
                  type="no-results"
                  colSpan={table.getAllColumns().length}
                />
              )}

            {!props.loading &&
              props.data &&
              table &&
              table.getRowModel().rows.map((row, i) => {
                return (
                  <tr key={`mobile-${i}`} className="border-b md:hidden">
                    <td colSpan={row.getVisibleCells().length}>
                      <MobileListItem
                        type={props.type}
                        row={row}
                        onClick={(e: number) =>
                          props.handleMobileClick
                            ? props.handleMobileClick(e)
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                );
              })}

            {!props.loading &&
              props.data &&
              table &&
              table.getRowModel().rows.map((row, i) => {
                return (
                  <tr
                    key={`web-${i}`}
                    className="group hidden h-16 md:table-row"
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      return (
                        <td
                          key={`child-${index}`}
                          className={classNames(
                            "h-16 border-y border-b-neutral-200 px-4 md:border-b",
                          )}
                          style={{
                            width:
                              cell.column.getSize() === Number.MAX_SAFE_INTEGER
                                ? "auto"
                                : cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {props.loading && <PaginationSkeletonLoading />}

      {!props.loading && props.data && props.data.length > 0 && (
        <Pagination
          data={props.pagination}
          currentPageLength={props.data.length}
        />
      )}
    </div>
  );
};

export default Table;
