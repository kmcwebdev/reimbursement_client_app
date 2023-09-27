/* eslint-disable @typescript-eslint/no-unsafe-call */
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { HiCurrencyDollar } from "react-icons-all-files/hi/HiCurrencyDollar";
import { IoMdClose } from "react-icons-all-files/io/IoMdClose";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import { MdLabel } from "react-icons-all-files/md/MdLabel";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { resetPageTableState } from "~/features/page-state.slice";
import { useAllExpenseTypesQuery } from "~/features/reimbursement-api-slice";
import { classNames } from "~/utils/classNames";
import { Button } from "../Button";
import StatusBadge, { type StatusType } from "../StatusBadge";

interface FilterViewProps {
  colSpan: number;
}

interface IFilters {
  request_status_ids: string[];
  request_types_ids: string[];
  expense_type_ids: string[];
  date: string[];
}

const FilterView: React.FC<FilterViewProps> = ({ colSpan }) => {
  const { filters } = useAppSelector((state) => state.pageTableState);
  const dispatch = useAppDispatch();
  const [filterViewState, setFilterViewState] = useState<IFilters>();

  const { data: allExpenseTypes, isLoading: allExpenseTypesIsLoading } =
    useAllExpenseTypesQuery({});

  useMemo(() => {
    const transformedFilters: IFilters = {
      request_status_ids: [],
      request_types_ids: [],
      expense_type_ids: [],
      date: [],
    };

    if (Object.keys(filters).length > 0) {
      Object.keys(filters).map((key) => {
        if (key === "from") {
          transformedFilters.date[0] = dayjs(filters.from).format("MM/DD/YYYY");
        }

        if (key === "to") {
          transformedFilters.date[1] = dayjs(filters.to).format("MM/DD/YYYY");
        }
        if (key === "expense_type_ids") {
          if (filters.expense_type_ids) {
            transformedFilters[key as keyof IFilters] =
              filters.expense_type_ids.split(",");
          }
        }

        if (key === "request_status_ids") {
          if (filters.request_status_ids) {
            transformedFilters[key as keyof IFilters] =
              filters.request_status_ids.split(",");
          }
        }

        // if (key === "request_type_ids") {
        //   if (filters.request_type_ids) {
        //     transformedFilters[key as keyof IFilters] =
        //       filters.request_type_ids.split(",");
        //   }
        // }
      });
    }

    setFilterViewState(transformedFilters);
  }, [filters]);

  const handleClear = () => {
    dispatch(resetPageTableState());
  };

  return (
    <tr className="">
      <td colSpan={colSpan}>
        <div
          className={classNames(
            Object.keys(filters).length > 0
              ? "h-16 border-b  border-b-[#F1F2F4] px-4 opacity-100 first:px-0"
              : "h-0 p-0 opacity-0",
            "flex items-center justify-between gap-4 overflow-hidden transition-all ease-in-out",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">Filters: </span>

            <div className="flex items-center gap-8">
              {Object.keys(filters).length > 0 &&
                filterViewState &&
                Object.keys(filterViewState).map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    {key === "request_status_ids" &&
                      filterViewState.request_status_ids.length > 0 && (
                        <MdLabel className="h-4 w-4 text-neutral-900" />
                      )}

                    {key === "request_type_ids" &&
                      filterViewState.request_types_ids.length > 0 && (
                        <MdAccessTimeFilled className="h-4 w-4 text-neutral-900" />
                      )}

                    {key === "expense_type_ids" &&
                      filterViewState.expense_type_ids.length > 0 && (
                        <HiCurrencyDollar className="h-4 w-4 text-neutral-900" />
                      )}

                    {key === "date" && filterViewState.date.length > 0 && (
                      <MdCalendarToday className="h-4 w-4 text-neutral-900" />
                    )}

                    {filterViewState[key as keyof IFilters].length > 0 && (
                      <div className="flex gap-2 divide-x">
                        {filterViewState[key as keyof IFilters].map((value) => (
                          <span key={key + "-" + value}>
                            {key === "request_status_ids" && (
                              <StatusBadge
                                key={value}
                                status={value.toLowerCase() as StatusType}
                              />
                            )}

                            {key === "expense_type_ids" && (
                              <p
                                key={value}
                                className="pl-2 text-sm text-neutral-800"
                              >
                                {allExpenseTypesIsLoading
                                  ? "..."
                                  : allExpenseTypes?.find(
                                      (a) => a.expense_type_id === value,
                                    )?.expense_type}
                              </p>
                            )}

                            {key === "request_type_ids" && (
                              <p
                                key={value}
                                className="pl-2 text-sm text-neutral-800"
                              >
                                {value}
                              </p>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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
