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
  type Table,
} from "@tanstack/react-table";

import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setSelectedItems } from "~/features/state/table-state.slice";
import { type IResponsePagination } from "~/types/global-types";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
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
  loading?: boolean;
  handleMobileClick?: (e: number) => void;
  pagination: IResponsePagination;
  columns: ColumnDef<IReimbursementRequest>[];
  type: TableType;
  data?: IReimbursementRequest[];
};

export interface CustomFilterMeta extends FilterMeta {
  filterComponent: () => JSX.Element;
}

const Table: React.FC<TableProps> = (props) => {
  const { columns, header } = props;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const dispatch = useAppDispatch();
  const { selectedItems, filters } = useAppSelector(
    (state) => state.pageTableState,
  );

  useEffect(() => {
    if (!props.loading && rowSelection && selectedItems) {
      const selectedItems: number[] = [];

      Object.keys(rowSelection).forEach((key) => {
        if (props.data) {
          selectedItems.push(props.data[key as unknown as number].id);
        }
      });

      dispatch(setSelectedItems(selectedItems));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  /** Resets the row selection state to its initial state/no selected record */
  useEffect(() => {
    const selected = selectedItems;
    if (Array.isArray(selected) && selected.length === 0) {
      table.resetRowSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const table = useReactTable<IReimbursementRequest>({
    data: props.data!,
    columns,
    state: {
      rowSelection: selectedItems ? rowSelection : undefined,
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
              Object.keys(filters).length === 0 &&
              table && <TableEmptyState type={props.type} colSpan={11} />}
            {/* EMPTY STATE NO FILTER RESULTS */}

            {!props.loading &&
              props.data &&
              props.data.length === 0 &&
              table &&
              Object.keys(filters).length > 0 && (
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
