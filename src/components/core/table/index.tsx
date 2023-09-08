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
  type ColumnFiltersState,
  type FilterMeta,
  type PaginationState,
  type RowSelectionState,
  type Table,
} from "@tanstack/react-table";

import { MdBrowserNotSupported } from "react-icons-all-files/md/MdBrowserNotSupported";
import {
  type ReimbursementApproval,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import EmptyState from "../EmptyState";
import FilterView from "./FilterView";
// import Pagination from "./Pagination";

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

type ReimbursementTable = {
  type: "reimbursements";
  data: ReimbursementRequest[];
};

type ApprovalTable = {
  type: "approvals";
  data: ReimbursementApproval[];
};

type TableProps = {
  loading?: boolean;
  tableState?: ITableState;
  tableStateActions?: ITableStateActions;
  columns: any;
} & (ReimbursementTable | ApprovalTable);

interface CustomFilterMeta extends FilterMeta {
  filterComponent: (info: {
    column: Column<any, unknown>;
    table: Table<any>;
  }) => JSX.Element;
}

const Table: React.FC<TableProps> = (props) => {
  const { data, columns } = props;
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
        selectedItems.push(
          props.data[key as unknown as number].reimbursement_request_id,
        );
      });
      props.tableStateActions?.setSelectedItems(selectedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const table = useReactTable<ReimbursementRequest | ReimbursementApproval>({
    data,
    columns,
    state: {
      ...props.tableState,
      rowSelection: props.tableState?.selectedItems ? rowSelection : undefined,
    },
    onColumnFiltersChange: props.tableStateActions?.setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: props.tableStateActions?.setPagination,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: props.tableStateActions?.setColumnFilters
      ? getFilteredRowModel()
      : undefined,
    getPaginationRowModel: props.tableState?.pagination
      ? getPaginationRowModel()
      : undefined,
    enableRowSelection: props.tableStateActions?.setSelectedItems
      ? true
      : false,
    manualPagination: true,
  });

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden">
      <div className="min-h-[300px] overflow-x-auto bg-white">
        <table className=" w-full overflow-x-scroll whitespace-nowrap bg-white">
          <thead className="h-12 border-b border-neutral-300 text-xs">
            {table.getHeaderGroups().map((headerGroup, i) => (
              <tr key={i}>
                {headerGroup.headers.map((header, i) => {
                  return (
                    <th
                      {...{
                        style: {
                          width: header.getSize(),
                          minWidth: header.getSize(),
                          maxWidth: header.getSize(),
                        },
                      }}
                      key={i}
                      colSpan={header.colSpan}
                      className=" px-4"
                    >
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
          <tbody className="min-h-[calc(300px-3rem)]">
            {props.tableState && props.tableState.columnFilters && (
              <FilterView
                colSpan={table.getAllColumns().length}
                columns={props.tableState.columnFilters?.map((a) =>
                  table.getColumn(a.id),
                )}
              />
            )}

            {table.getRowModel().rows.length === 0 && (
              <tr className="h-72 bg-neutral-100">
                <td colSpan={table.getAllFlatColumns().length}>
                  <EmptyState
                    icon={MdBrowserNotSupported}
                    title="No Reimbursement Requests Available."
                    description="You may try to change your filter values to see records."
                  />
                </td>
              </tr>
            )}

            {table.getRowModel().rows.map((row, i) => {
              return (
                <tr key={i} className="h-16">
                  {row.getVisibleCells().map((cell, i) => {
                    return (
                      <td
                        key={i}
                        className=" border-b border-b-neutral-200 px-4 first:px-0"
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
      {/* <Pagination table={table} /> */}
    </div>
  );
};

export default Table;
