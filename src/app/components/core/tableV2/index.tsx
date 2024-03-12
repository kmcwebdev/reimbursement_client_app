/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useEffect, useState, type ChangeEvent } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  useReactTable,
  type ColumnDef,
  type FilterMeta,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  type QueryFilter,
  type ReimbursementRequest,
  type ResponsePagination,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import MobileListItem from "./MobileListItem";
import Pagination, { PaginationSkeletonLoading } from "./Pagination";
import TableEmptyState from "./TableEmptyState";
import DesktopHeader from "./TableHeader/DesktopHeader";
import DesktopTitle from "./TableHeader/DesktopHeader/DesktopTitle";
import MobileTableHeader from "./TableHeader/MobileHeader";
import TableSkeletonLoaders from "./TableSkeletonLoaders";

export type TableType =
  | "reimbursement"
  | "finance"
  | "approval"
  | "admin"
  | "history";

export type TableHeaderProps = {
  isLoading: boolean;
  title: string;
  button: "approve" | "download" | "create" | "credit";
  buttonClickHandler: () => void;
  buttonIsVisible: boolean;
  searchIsLoading: boolean;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
};

type TableProps = {
  header: TableHeaderProps;
  tableState: { filters: QueryFilter | null; selectedItems?: number[] };
  tableActions: {
    setSelectedItems?: (e: number[]) => void;
    resetTableState: () => void;
    setFilters: (e: QueryFilter | null) => void;
  };
  loading?: boolean;
  pagination: ResponsePagination;
  columns: ColumnDef<ReimbursementRequest>[];
  type: TableType;
  data?: ReimbursementRequest[];
};

export interface CustomFilterMeta extends FilterMeta {
  filterComponent: () => JSX.Element;
}

const TableV2: React.FC<TableProps> = (props) => {
  const { columns, header } = props;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (!props.loading && rowSelection && props.tableState.selectedItems) {
      const selectedItems: number[] = [];

      Object.keys(rowSelection).forEach((key) => {
        if (props.data) {
          selectedItems.push(props.data[key as unknown as number].id);
        }
      });

      if (props.tableActions.setSelectedItems) {
        props.tableActions.setSelectedItems(selectedItems);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  /** Resets the row selection state to its initial state/no selected record */
  useEffect(() => {
    if (props.tableState.selectedItems) {
      const selected = props.tableState.selectedItems;
      if (Array.isArray(selected) && selected.length === 0) {
        table.resetRowSelection();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tableState.selectedItems]);

  const table = useReactTable<ReimbursementRequest>({
    data: props.data!,
    columns,
    state: {
      rowSelection: props.tableState.selectedItems ? rowSelection : undefined,
    },
    onRowSelectionChange: setRowSelection,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    manualPagination: true,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  return (
    <div
      className={classNames(
        "no-scrollbar flex h-full flex-col md:h-[70vh] md:flex-1",
        props.loading
          ? "overflow-hidden"
          : "md:overflow-x-auto md:overflow-y-hidden",
      )}
    >
      <DesktopTitle {...header} isFinanceTable={props.type === "finance"} />

      <div
        className={classNames(
          "no-scrollbar relative h-full w-full",
          props.loading
            ? "md:overflow-y-hidden"
            : "md:overflow-x-auto md:overflow-y-auto",
        )}
      >
        {/* TABLE HEADER */}
        <table className="relative w-full whitespace-nowrap">
          <DesktopHeader
            isLoading={props.loading ? true : false}
            data={props.data}
            headerGroups={table.getHeaderGroups()}
            numberOfColumns={table.getAllColumns().length}
            type={props.type}
            filters={props.tableState.filters}
            resetTableState={props.tableActions.resetTableState}
          />

          <MobileTableHeader
            {...header}
            isFinanceTable={props.type === "finance"}
            isLoading={props.loading ? true : false}
            headerGroups={table.getHeaderGroups()}
          />

          <tbody
            className={classNames(
              !props.loading && "shadow-sm",
              "relative h-full rounded-b-sm bg-white md:border-none",
            )}
          >
            {props.loading && (
              <TableSkeletonLoaders length={table.getAllFlatColumns().length} />
            )}

            {/* EMPTY STATE NO DATA */}
            {!props.loading &&
              props.data &&
              props.data.length === 0 &&
              !props.tableState.filters &&
              table && <TableEmptyState type={props.type} colSpan={11} />}
            {/* EMPTY STATE NO FILTER RESULTS */}

            {!props.loading &&
              props.data &&
              props.data.length === 0 &&
              table &&
              props.tableState.filters &&
              Object.keys(props.tableState.filters).length > 0 && (
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
                    <td>
                      <MobileListItem
                        type={props.type}
                        row={row}
                        selectedItems={props.tableState.selectedItems}
                        setSelectedItems={props.tableActions.setSelectedItems}
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
          setFilters={props.tableActions.setFilters}
          filters={props.tableState.filters}
        />
      )}
    </div>
  );
};

export default TableV2;
