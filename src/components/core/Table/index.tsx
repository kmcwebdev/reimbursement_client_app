import React, { type Dispatch, type SetStateAction } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Table,
} from "@tanstack/react-table";
import { type StatusType } from "../StatusBadge";
import Pagination from "./Pagination";
import StatusTypeFilter from "./filters/StatusTypeFilter";

export type Reimbursement = {
  status: StatusType;
  client: string;
  id: string;
  name: string;
  reimbursementId: string;
  type: string;
  expense: string;
  filed: string;
  payrollAccount: number,
  total: number;
};

interface TableProps {
  data: Reimbursement[];
  columns: ColumnDef<Reimbursement>[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  pagination,
  setPagination,
}) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  // const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex: pagination.pageIndex || 0,
        pageSize: pagination.pageSize || 10,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  return (
    <div className="flex flex-col gap-2 bg-white">
      <table className="bg-white">
        <thead className="h-12 border-b border-neutral-subtle text-xs">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className=" px-4"
                  >
                    <div className="flex items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {header.column.columnDef?.meta && (
                        <div>
                          <StatusTypeFilter
                            column={header.column}
                            table={table}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="h-16">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
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
