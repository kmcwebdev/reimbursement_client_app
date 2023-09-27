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

import { MdBrowserNotSupported } from "react-icons-all-files/md/MdBrowserNotSupported";
import {
  type IReimbursementsFilterQuery,
  type ReimbursementApproval,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import EmptyState from "../EmptyState";
import SkeletonLoading from "../SkeletonLoading";
import FilterView from "./FilterView";
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
  filterComponent: (info: {
    tableType: "approvals" | "reimbursements" | "finance";
  }) => JSX.Element;
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
      <div className="min-h-[300px] overflow-x-auto bg-white">
        <table className=" w-full overflow-x-scroll whitespace-nowrap bg-white">
          <thead className="h-12 border-b border-neutral-300 text-xs">
            {props.data &&
              table.getHeaderGroups().map((headerGroup, i) => (
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
                            ).filterComponent({ tableType: props.type })}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
          </thead>
          <tbody className="min-h-[calc(300px-3rem)]">
            {props.loading && (
              <tr className="bg-neutral-100">
                <td colSpan={table.getAllFlatColumns().length}>
                  <div className="min-h-[calc(300px-3rem)]">
                    {Array.from({ length: 10 }).map((_a, i) => (
                      <div
                        key={i}
                        className="flex h-12 items-center justify-evenly border-b"
                      >
                        <SkeletonLoading className="h-5 w-14 rounded-md" />
                        <SkeletonLoading className="h-5 w-14 rounded-md" />
                        <SkeletonLoading className="h-5 w-14 rounded-md" />
                        <SkeletonLoading className="h-5 w-14 rounded-md" />
                        <SkeletonLoading className="h-5 w-14 rounded-md" />
                        <SkeletonLoading className="h-5 w-14 rounded-md" />
                        <SkeletonLoading className="h-5 w-14 rounded-md" />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {!props.loading &&
              props.data &&
              props.data.length > 0 &&
              props.tableState &&
              props.tableState.filters && (
                <FilterView
                  colSpan={table.getAllColumns().length}
                  filters={props.tableState.filters}
                  type={props.type}
                />
              )}

            {/* Data is empty */}

            {props.data && props.data.length === 0 && (
              <tr>
                <td colSpan={table.getAllFlatColumns().length}>
                  <div className="py-4">
                    <div className="grid h-96 place-items-center rounded-md  bg-neutral-100 py-10">
                      {props.type === "approvals" && (
                        <EmptyState
                          icon={MdBrowserNotSupported}
                          title="No Reimbursement Requests to Approve."
                          description="You have 0 pending approvals."
                        />
                      )}

                      {props.type === "reimbursements" && (
                        <EmptyState
                          icon={MdBrowserNotSupported}
                          title="No Pending Reimbursement Requests"
                          description={`Submit a reimbursement request by clicking the "Reimburse" button above the table.`}
                        />
                      )}

                      {props.type === "finance" && (
                        <EmptyState
                          icon={MdBrowserNotSupported}
                          title="No Reimbursement Requests"
                          description="You have 0 pending approvals."
                        />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {/* Filter returns 0 record */}
            {!props.loading &&
              props.data &&
              props.data.length > 0 &&
              table.getRowModel().rows.length === 0 && (
                <tr className="h-72 bg-neutral-100">
                  <td colSpan={table.getAllFlatColumns().length}>
                    <div className="py-4">
                      <div className="grid h-96 place-items-center rounded-md  bg-neutral-100 py-10">
                        <EmptyState
                          icon={MdBrowserNotSupported}
                          title="No Reimbursement Requests Available."
                          description="You may try to change your filter values to see records."
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )}

            {!props.loading &&
              props.data &&
              table.getRowModel().rows.map((row, i) => {
                return (
                  <tr key={i} className="group h-16">
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
