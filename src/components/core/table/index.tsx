/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  useReactTable,
  type FilterMeta,
  type PaginationState,
  type RowSelectionState,
  type Table,
} from "@tanstack/react-table";

import {
  type IReimbursementsFilterQuery,
  type ReimbursementApproval,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import FilterView from "./FilterView";
import MobileListItem from "./MobileListItem";
import TableEmptyState from "./TableEmptyState";
import TableSkeleton from "./TableSkeleton";

export type ITableState = {
  filters: IReimbursementsFilterQuery;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems?: any;
  pagination?: PaginationState;
};

export type ITableStateActions = {
  setSelectedItems?: (value: string[]) => void;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
};

type ReimbursementTable = {
  type: "reimbursements";
  data?: ReimbursementRequest[];
};

type HistoryTable = {
  type: "history";
  data?: ReimbursementRequest[];
};

type ApprovalTable = {
  type: "approvals";
  data?: ReimbursementApproval[];
};

type FinanceTable = {
  type: "finance";
  data?: ReimbursementApproval[];
};

type TableProps = {
  loading?: boolean;
  tableState?: ITableState;
  tableStateActions?: ITableStateActions;
  handleMobileClick?: (e: string) => void;
  columns: any;
} & (ReimbursementTable | ApprovalTable | FinanceTable | HistoryTable);

interface CustomFilterMeta extends FilterMeta {
  filterComponent: () => JSX.Element;
}

const Table: React.FC<TableProps> = (props) => {
  const { columns } = props;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (
      !props.loading &&
      rowSelection &&
      props.tableState &&
      props.tableStateActions &&
      props.tableState.selectedItems &&
      props.tableStateActions.setSelectedItems
    ) {
      const selectedItems: string[] = [];

      Object.keys(rowSelection).forEach((key) => {
        if (props.data) {
          selectedItems.push(
            props.data[key as unknown as number].reimbursement_request_id,
          );
        }
      });
      props.tableStateActions?.setSelectedItems(selectedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const table = useReactTable<ReimbursementRequest | ReimbursementApproval>({
    data: props.data!,
    columns,
    state: {
      ...props.tableState,
      rowSelection: props.tableState?.selectedItems ? rowSelection : undefined,
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: props.tableStateActions?.setPagination,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: props.tableState?.pagination
      ? getPaginationRowModel()
      : undefined,
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

  return (
    <div className="flex h-[31.5rem] flex-col gap-4 overflow-x-auto overflow-y-hidden">
      <div className="h-full w-full  overflow-y-auto">
        {/* TABLE HEADER */}
        <table className="relative w-full whitespace-nowrap">
          <thead className="sticky top-0 z-[5] hidden h-12 rounded-t-sm bg-white text-xs shadow-sm  md:table-header-group">
            {props.data &&
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

                          {header.column.columnDef?.meta &&
                            (header.column.columnDef?.meta as CustomFilterMeta)
                              .filterComponent &&
                            (
                              header.column.columnDef?.meta as CustomFilterMeta
                            ).filterComponent()}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
          </thead>

          <tbody className="relative h-full w-full rounded-b-sm bg-white p-4 shadow-sm">
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
                  <tr key={`mobile-${i}`} className="md:hidden">
                    <td colSpan={row.getVisibleCells().length}>
                      <MobileListItem
                        type={props.type}
                        row={row}
                        onClick={(e: string) =>
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
        {/* SKELETON LOADING */}
      </div>
      {/* <Pagination table={table} /> */}
    </div>
  );
};

export default Table;
