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
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterMeta,
  type PaginationState,
  type RowSelectionState,
  type Table,
} from "@tanstack/react-table";
import { type StatusType } from "../StatusBadge";
import Pagination from "./Pagination";

export type Reimbursement = {
  status: StatusType;
  client: string;
  id: string;
  name: string;
  reimbursementId: string;
  type: string;
  expense: string;
  filed: string;
  payrollAccount: number;
  total: number;
};

export type ITableState = {
  columnFilters?: ColumnFiltersState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems?: any;
  pagination?: PaginationState;
};

export type ITableStateActions = {
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  setSelectedItems?: Dispatch<SetStateAction<any>>;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
};

type TableProps = {
  data: Reimbursement[];
  columns: ColumnDef<Reimbursement>[];
  tableState?: ITableState;
  tableStateActions?: ITableStateActions;
};

interface CustomFilterMeta extends FilterMeta {
  filterComponent: (info: {
    column: Column<any, unknown>;
    table: Table<any>;
  }) => JSX.Element;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  tableState,
  tableStateActions,
}) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (
      rowSelection &&
      tableState &&
      tableStateActions &&
      tableState.selectedItems &&
      tableStateActions.setSelectedItems
    ) {
      const selectedItems: number[] = [];

      Object.keys(rowSelection).forEach((key) => {
        selectedItems.push(
          data[key as unknown as number].id as unknown as number,
        );
      });
      tableStateActions?.setSelectedItems(selectedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      pagination: tableState?.pagination ? tableState.pagination : undefined,
      columnFilters: tableState?.columnFilters,
      rowSelection: tableState?.selectedItems ? rowSelection : undefined,
    },
    onColumnFiltersChange: tableStateActions?.setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: tableStateActions?.setPagination,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: tableStateActions?.setColumnFilters
      ? getFilteredRowModel()
      : undefined,
    getPaginationRowModel: tableState?.pagination
      ? getPaginationRowModel()
      : undefined,
    enableRowSelection: tableStateActions?.setSelectedItems ? true : false,
    manualPagination: true,
    debugTable: true,
  });

  return (
    <div className="flex flex-col gap-2 bg-white">
      <table className="overflow-x-scroll bg-white">
        <thead className="h-12 border-b border-neutral-subtle text-xs">
          {table.getHeaderGroups().map((headerGroup, i) => (
            <tr key={i}>
              {headerGroup.headers.map((header, i) => {
                return (
                  <th key={i} colSpan={header.colSpan} className=" px-4">
                    <div className="flex items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {header.column.columnDef?.meta &&
                        (header.column.columnDef?.meta as CustomFilterMeta)
                          .filterComponent &&
                        (
                          header.column.columnDef?.meta as CustomFilterMeta
                        ).filterComponent({
                          column: header.column,
                          table,
                        })}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => {
            return (
              <tr key={i} className="h-16">
                {row.getVisibleCells().map((cell, i) => {
                  return (
                    <td
                      key={i}
                      className=" border-b border-b-[#F1F2F4] px-4 first:px-0"
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

      <Pagination table={table} />
    </div>
  );
};

export default Table;
