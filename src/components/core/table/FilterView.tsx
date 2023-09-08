/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Column } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { HiCurrencyDollar } from "react-icons-all-files/hi/HiCurrencyDollar";
import { IoMdClose } from "react-icons-all-files/io/IoMdClose";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import { MdLabel } from "react-icons-all-files/md/MdLabel";
import { statusOptions } from "~/constants/status-options";
import {
  type ReimbursementApproval,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { Button } from "../Button";
import StatusBadge, { type StatusType } from "../StatusBadge";

interface FilterViewProps {
  colSpan: number;
  columns: (
    | Column<ReimbursementRequest | ReimbursementApproval, unknown>
    | undefined
  )[];
}

interface FilterState {
  key: string;
  value: string[];
}

const FilterView: React.FC<FilterViewProps> = ({ columns, colSpan }) => {
  const [dateFilterValue, setDateFilterValue] = useState<string[]>([]);
  const [dateFilterIsVisible, setDateFilterIsVisible] = useState<boolean>();
  const [filterViewState, setFilterViewState] = useState<FilterState[]>([]);

  useMemo(() => {
    const filterOrder = ["request_status", "request_type", "expense_type"];
    const columnsThatHasFilters = columns.filter((a) => a?.getIsFiltered());
    const headers = columnsThatHasFilters.map((a) => a?.id);
    const filterViewStateCopy: FilterState[] = [];

    if (headers && headers.length > 0) {
      headers
        .sort((a, b) => {
          const index1 = filterOrder.indexOf(a as string);
          const index2 = filterOrder.indexOf(b as string);
          return index1 == -1 ? 1 : index2 == -1 ? -1 : index1 - index2;
        })
        .map((header) => {
          const filteredColumn = columnsThatHasFilters.find(
            (a) => a?.id === header,
          );

          if (filteredColumn && header) {
            if (header === "request_status") {
              const filterValue = filteredColumn.getFilterValue() as string[];
              if (filterValue !== statusOptions) {
                if (filterViewStateCopy.find((a) => a.key === header)) {
                  const filtered = filterViewStateCopy.filter(
                    (a) => a.key !== header,
                  );
                  filtered.push({ key: header, value: filterValue });
                  setFilterViewState(filtered);
                } else {
                  filterViewStateCopy.push({ key: header, value: filterValue });
                  setFilterViewState(filterViewStateCopy);
                }
              } else {
                const copy = filterViewStateCopy.filter(
                  (a) => a.key !== header,
                );
                setFilterViewState(copy);
              }
            } else {
              const filterValue = filteredColumn.getFilterValue() as string[];
              const sortedUniqueValues = Array.from(
                filteredColumn.getFacetedUniqueValues().keys(),
              ).sort() as string[];
              if (filterValue.length < sortedUniqueValues.length) {
                if (filterViewStateCopy.find((a) => a.key === header)) {
                  const filtered = filterViewStateCopy.filter(
                    (a) => a.key !== header,
                  );
                  filtered.push({ key: header, value: filterValue });
                  setFilterViewState(filtered);
                } else {
                  filterViewStateCopy.push({ key: header, value: filterValue });
                  setFilterViewState(filterViewStateCopy);
                }
              } else {
                const copy = filterViewStateCopy.filter(
                  (a) => a.key !== header,
                );
                setFilterViewState(copy);
              }
            }
          }
        });
    }

    /**Check date filed filter value if has value */
    const dateFiledColumn = columns.find(
      (column) => column && column.id === "created_at",
    );

    if (dateFiledColumn) {
      const filterValue: string[] =
        dateFiledColumn.getFilterValue() as string[];
      setDateFilterValue(filterValue);
      setDateFilterIsVisible(filterValue && filterValue.length > 0);
    } else {
      setDateFilterIsVisible(false);
    }
  }, [columns]);

  const handleClear = () => {
    const statusColumn = columns.find(
      (column) => column && column.id === "request_status",
    );
    const typeColumn = columns.find(
      (column) => column && column.id === "request_type",
    );
    const expenseColumn = columns.find(
      (column) => column && column.id === "expense_type",
    );
    const dateFiledColumn = columns.find(
      (column) => column && column.id === "created_at",
    );

    if (statusColumn) {
      statusColumn.setFilterValue(statusOptions);
    }

    if (typeColumn) {
      typeColumn.setFilterValue(
        Array.from(typeColumn.getFacetedUniqueValues().keys()),
      );
    }

    if (expenseColumn) {
      expenseColumn.setFilterValue(
        Array.from(expenseColumn.getFacetedUniqueValues().keys()),
      );
    }

    if (dateFiledColumn) {
      dateFiledColumn.setFilterValue(undefined);
    }
  };

  return (
    <tr className="">
      <td colSpan={colSpan}>
        <div
          className={classNames(
            filterViewState.length > 0
              ? "h-16 border-b  border-b-[#F1F2F4] px-4 opacity-100 first:px-0"
              : "h-0 p-0 opacity-0",
            "flex items-center justify-between gap-4 overflow-hidden transition-all duration-500 ease-in-out",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">Filters: </span>

            <div className="flex items-center gap-8">
              {filterViewState.length > 0 &&
                filterViewState.map((state) => (
                  <div key={state.key} className="flex items-center gap-2">
                    {state.key === "request_status" && (
                      <MdLabel className="h-4 w-4 text-neutral-900" />
                    )}

                    {state.key === "request_type" && (
                      <MdAccessTimeFilled className="h-4 w-4 text-neutral-900" />
                    )}

                    {state.key === "expense_type" && (
                      <HiCurrencyDollar className="h-4 w-4 text-neutral-900" />
                    )}

                    <div className="flex gap-2 divide-x">
                      {state.value.map((value) => (
                        <>
                          {state.key === "request_status" ? (
                            <StatusBadge
                              key={value}
                              status={value.toLowerCase() as StatusType}
                            />
                          ) : (
                            <p
                              key={value}
                              className="pl-2 text-sm text-neutral-800"
                            >
                              {value}
                            </p>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                ))}

              {dateFilterIsVisible && (
                <div className="flex items-center gap-2">
                  <MdCalendarToday className="h-4 w-4 text-neutral-900" />
                  <div className="flex items-center gap-1">
                    {dateFilterValue.map((value, i) => (
                      <p key={value} className="text-sm text-neutral-800">
                        {value}
                        {dateFilterValue.length === 2 && i === 0 && " -"}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button buttonType="text" variant="danger" onClick={handleClear}>
            <div className="flex gap-1">
              <IoMdClose className="h-5 w-5" /> Clear All
            </div>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default FilterView;
