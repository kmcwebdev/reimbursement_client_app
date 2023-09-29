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
import TableEmptyState from "./TableEmptyState";
import TableSkeleton from "./TableSkeleton";
// import Pagination from "./Pagination";

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
  columns: any;
} & (ReimbursementTable | ApprovalTable | FinanceTable);

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
  });

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden">
      <div className="overflow-x-auto overflow-y-hidden">
        {/* TABLE HEADER */}
        <table className="w-full whitespace-nowrap">
          <thead className="h-12 rounded-t-sm bg-white text-xs shadow-sm">
            {props.data &&
              table.getHeaderGroups().map((headerGroup, i) => (
                <tr key={i} className="h-12 border-b">
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
                            ).filterComponent()}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}

            <FilterView colSpan={table.getAllColumns().length} />
          </thead>
        </table>

        {/* SKELETON LOADING */}
        {props.loading && (
          <TableSkeleton length={table.getAllFlatColumns().length} />
        )}

        {/* SKELETON LOADING NO DATA */}

        {!props.loading && props.data && props.data.length === 0 && (
          <TableEmptyState
            type={props.type}
            length={table.getAllFlatColumns().length}
          />
        )}

        {/* SKELETON LOADING NO FILTER RESULTS */}
        {!props.loading &&
          props.data &&
          props.data.length > 0 &&
          table.getRowModel().rows.length === 0 && (
            <TableEmptyState
              type="no-results"
              length={table.getAllFlatColumns().length}
            />
          )}

        {/* TABLE DATA */}
        <div className="h-[30rem] overflow-y-auto">
          <table className="w-full whitespace-nowrap">
            <tbody className="h-full min-h-[70vh] rounded-b-sm bg-white shadow-sm">
              {!props.loading &&
                props.data &&
                table.getRowModel().rows.map((row, i) => {
                  return (
                    <tr key={i} className="group h-16">
                      {row.getVisibleCells().map((cell, i) => {
                        return (
                          <td
                            key={i}
                            className={classNames(
                              cell.column.columnDef.id === "select"
                                ? "px-0"
                                : "px-4",
                              "border-b border-b-neutral-200 ",
                            )}
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

        {/* TABLE DATA */}
      </div>
      {/* <Pagination table={table} /> */}
    </div>
  );
};

export default Table;
