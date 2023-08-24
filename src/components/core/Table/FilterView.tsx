/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Column } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { HiCurrencyDollar } from "react-icons-all-files/hi/HiCurrencyDollar";
import { IoMdClose } from "react-icons-all-files/io/IoMdClose";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import { MdLabel } from "react-icons-all-files/md/MdLabel";
import { statusOptions } from "~/constants/status-options";
import { classNames } from "~/utils/classNames";
import { type Reimbursement } from ".";
import { Button } from "../Button";
import StatusBadge, { type StatusType } from "../StatusBadge";

interface FilterViewProps {
  colSpan: number;
  columns: (Column<Reimbursement, unknown> | undefined)[];
}

const FilterView: React.FC<FilterViewProps> = ({ columns, colSpan }) => {
  const [statusFilterIsVisible, setStatusFilterIsVisible] =
    useState<boolean>(false);
  const [typeFilterIsVisible, setTypeFilterIsVisible] =
    useState<boolean>(false);
  const [expenseFilterIsVisible, setExpenseFilterIsVisible] =
    useState<boolean>(false);
  const [dateFilterIsVisible, setDateFilterIsVisible] =
    useState<boolean>(false);

  const [statusFilterValue, setStatusFilterValue] = useState<string[]>([]);
  const [typeFilterValue, setTypeFilterValue] = useState<string[]>([]);
  const [expenseFilterValue, setExpenseFilterValue] = useState<string[]>([]);
  const [dateFilterValue, setDateFilterValue] = useState<string[]>([]);

  useEffect(() => {
    /**Check status filter value if equal to status options */
    const statusColumn = columns.find(
      (column) => column && column.id === "status",
    );
    if (statusColumn) {
      const filterValue: string[] = statusColumn.getFilterValue() as string[];
      setStatusFilterValue(filterValue);
      setStatusFilterIsVisible(filterValue.length < statusOptions.length);
    }

    /**Check reimbursement type filter value length if equal to 2 */
    const typeColumn = columns.find((column) => column && column.id === "type");
    if (typeColumn) {
      const filterValue: string[] = typeColumn.getFilterValue() as string[];
      setTypeFilterValue(filterValue);
      setTypeFilterIsVisible(filterValue.length < 2);
    }

    /**Check expense type filter value if equal to expense type = column faceted unique values */
    const expenseColumn = columns.find(
      (column) => column && column.id === "expense",
    );
    if (expenseColumn) {
      const filterValue: string[] = expenseColumn.getFilterValue() as string[];
      setExpenseFilterValue(filterValue);
      setExpenseFilterIsVisible(
        filterValue.length <
          Array.from(expenseColumn.getFacetedUniqueValues().keys()).length,
      );
    }

    /**Check date filed filter value if has value */
    const dateFiledColumn = columns.find(
      (column) => column && column.id === "filed",
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
      (column) => column && column.id === "status",
    );
    const typeColumn = columns.find((column) => column && column.id === "type");
    const expenseColumn = columns.find(
      (column) => column && column.id === "expense",
    );
    const dateFiledColumn = columns.find(
      (column) => column && column.id === "filed",
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
            statusFilterIsVisible ||
              typeFilterIsVisible ||
              expenseFilterIsVisible ||
              dateFilterIsVisible
              ? "h-16 border-b  border-b-[#F1F2F4] px-4 opacity-100 first:px-0"
              : "h-0 p-0 opacity-0",
            "flex items-center justify-between gap-4 overflow-hidden transition-all duration-500 ease-in-out",
          )}
        >
          <div className="flex items-center gap-4">
            <span className="font-bold">Filters: </span>

            {columns.map((column) => (
              <div key={column?.id} className="flex items-center">
                {statusFilterIsVisible && column && column.id === "status" && (
                  <div className="flex items-center gap-2">
                    <MdLabel className="h-5 w-5" />
                    <div className="flex gap-2 divide-x">
                      {statusFilterValue.map((value) => (
                        <StatusBadge key={value} status={value as StatusType} />
                      ))}
                    </div>
                  </div>
                )}

                {typeFilterIsVisible && column && column.id === "type" && (
                  <div className="flex items-center gap-2">
                    <MdAccessTimeFilled className="h-5 w-5" />
                    <div className="flex gap-2 divide-x">
                      {typeFilterValue.map((value) => (
                        <p key={value} className="pl-2 text-sm">
                          {value}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {expenseFilterIsVisible &&
                  column &&
                  column.id === "expense" && (
                    <div className="flex items-center gap-2">
                      <HiCurrencyDollar className="h-5 w-5" />
                      <div className="flex gap-2 divide-x">
                        {expenseFilterValue.map((value) => (
                          <p key={value} className="pl-2 text-sm">
                            {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                {dateFilterIsVisible && column && column.id === "filed" && (
                  <div className="flex items-center gap-2">
                    <MdCalendarToday className="h-5 w-5" />
                    <div className="flex gap-2 divide-x">
                      {dateFilterValue.map((value) => (
                        <p key={value} className="pl-2 text-sm">
                          {value}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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
