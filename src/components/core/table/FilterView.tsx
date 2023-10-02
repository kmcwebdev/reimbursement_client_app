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
import {
  useAllExpenseTypesQuery,
  useAllStatusesQuery,
  useRequestTypesQuery,
} from "~/features/reimbursement-api-slice";
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
  reimbursement_type_id: string[];
  date: string[];
}

const FilterView: React.FC<FilterViewProps> = ({ colSpan }) => {
  const { filters } = useAppSelector((state) => state.pageTableState);
  const dispatch = useAppDispatch();
  const [filterViewState, setFilterViewState] = useState<IFilters>();

  const { data: allExpenseTypes, isLoading: allExpenseTypesIsLoading } =
    useAllExpenseTypesQuery({});

  const { isLoading: requestTypesIsLoading, data: requestTypes } =
    useRequestTypesQuery();

  const { data: allStatuses, isLoading: allStatusesIsLoading } =
    useAllStatusesQuery({});

  useMemo(() => {
    const transformedFilters: IFilters = {
      request_status_ids: [],
      request_types_ids: [],
      expense_type_ids: [],
      reimbursement_type_id: [],
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
            transformedFilters.expense_type_ids =
              filters.expense_type_ids.split(",");
          }
        }

        if (key === "request_status_ids") {
          if (filters.request_status_ids) {
            transformedFilters.request_status_ids =
              filters.request_status_ids.split(",");
          }
        }

        if (key === "reimbursement_type_id") {
          if (filters.reimbursement_type_id) {
            transformedFilters.reimbursement_type_id =
              filters.reimbursement_type_id.split(",");
          }
        }
      });
    }

    setFilterViewState(transformedFilters);
  }, [filters]);

  const handleClear = () => {
    dispatch(resetPageTableState());
  };

  return (
    <tr className="sticky top-12 z-[4] bg-white shadow-sm">
      <th
        colSpan={colSpan}
        className={classNames(
          Object.keys(filters).length > 0
            ? "h-16 px-4 opacity-100 first:px-0"
            : "h-0 p-0 opacity-0",
          "overflow-hidden",
        )}
      >
        <div
          className={classNames(
            Object.keys(filters).length > 0
              ? "h-16 px-4 opacity-100 first:px-0"
              : "h-0 p-0 opacity-0",
            "relative flex items-center justify-between gap-4 overflow-hidden transition-all ease-in-out",
          )}
        >
          <div className="flex items-center gap-2 px-4">
            <span className="font-bold text-neutral-900">Filters: </span>
            <div className="flex items-center gap-4 overflow-x-auto">
              {Object.keys(filters).length > 0 &&
                filterViewState &&
                Object.keys(filterViewState).map((key) => (
                  <div key={key}>
                    {filterViewState[key as keyof IFilters].length > 0 && (
                      <div key={key} className="flex items-center gap-2">
                        {key === "request_status_ids" &&
                          filterViewState.request_status_ids.length > 0 && (
                            <MdLabel className="h-4 w-4 text-neutral-900" />
                          )}

                        {key === "reimbursement_type_id" &&
                          filterViewState.reimbursement_type_id.length > 0 && (
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
                          <div className="flex gap-2">
                            {filterViewState[key as keyof IFilters].map(
                              (value, i) => (
                                <span key={key + "-" + value}>
                                  {key === "request_status_ids" && (
                                    <span className="ml-4 first:ml-0">
                                      {allStatusesIsLoading ? (
                                        "..."
                                      ) : (
                                        <StatusBadge
                                          key={value}
                                          status={
                                            allStatuses
                                              ?.find(
                                                (a) =>
                                                  a.request_status_id === value,
                                              )
                                              ?.request_status.toLowerCase() as StatusType
                                          }
                                        />
                                      )}
                                    </span>
                                  )}

                                  {key === "expense_type_ids" && (
                                    <p
                                      key={value}
                                      className={classNames(
                                        i > 0 && "border-l",
                                        "pl-2 text-sm text-neutral-800",
                                      )}
                                    >
                                      {allExpenseTypesIsLoading
                                        ? "..."
                                        : allExpenseTypes?.find(
                                            (a) => a.expense_type_id === value,
                                          )?.expense_type}
                                    </p>
                                  )}

                                  {key === "reimbursement_type_id" && (
                                    <p
                                      key={value}
                                      className="pl-2 text-sm text-neutral-800"
                                    >
                                      {requestTypesIsLoading
                                        ? "..."
                                        : requestTypes?.find(
                                            (a) =>
                                              a.reimbursement_request_type_id ===
                                              value,
                                          )?.request_type}
                                    </p>
                                  )}

                                  {key === "date" && (
                                    <p
                                      key={value}
                                      className="pl-2 text-sm text-neutral-800"
                                    >
                                      {value}
                                    </p>
                                  )}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div className="absolute right-5">
            <Button buttonType="text" variant="danger" onClick={handleClear}>
              <div className="flex gap-1">
                <IoMdClose className="h-5 w-5" /> Clear All
              </div>
            </Button>
          </div>
        </div>
      </th>
    </tr>
  );
};

export default FilterView;
