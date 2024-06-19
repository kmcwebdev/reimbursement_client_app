/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { HiCurrencyDollar } from "react-icons-all-files/hi/HiCurrencyDollar";
import { IoMdClose } from "react-icons-all-files/io/IoMdClose";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import { MdGroup } from "react-icons-all-files/md/MdGroup";
import { MdLabel } from "react-icons-all-files/md/MdLabel";
import {
  useAllClientsQuery,
  useAllExpenseTypesQuery,
  useAllHRBPsQuery,
  useAllStatusesQuery,
  useRequestTypesQuery,
} from "~/features/api/references-api-slice";
import { type QueryFilter } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { type TableType } from "../..";
import { Button } from "../../../Button";
import StatusBadge, { type StatusType } from "../../../StatusBadge";

interface FilterViewProps {
  colSpan: number;
  type: TableType;
  filters: QueryFilter | null;
  resetTableState: () => void;
}

interface IFilters {
  request_status__id: string[];
  client_id: string[];
  hrbp_id: string[];
  request_type__id: string[];
  expense_type__id: string[];
  date: string[];
}

const FilterView: React.FC<FilterViewProps> = ({
  colSpan,
  type,
  filters,
  resetTableState,
}) => {
  const [filterViewState, setFilterViewState] = useState<IFilters>();

  const { data: allExpenseTypes, isLoading: allExpenseTypesIsLoading } =
    useAllExpenseTypesQuery({});

  const { isLoading: requestTypesIsLoading, data: requestTypes } =
    useRequestTypesQuery();

  const { data: allStatuses, isLoading: allStatusesIsLoading } =
    useAllStatusesQuery({});

  const { data: selectedClients, isLoading: selectedClientsIsLoading } =
    useAllClientsQuery({ id: filters?.client_id });

  const { data: selectedHRBPs, isLoading: selectedHRBPSIsLoading } =
    useAllHRBPsQuery({ id: filters?.hrbp_id });

  useMemo(() => {
    const transformedFilters: IFilters = {
      request_status__id: [],
      client_id: [],
      hrbp_id: [],
      expense_type__id: [],
      request_type__id: [],
      date: [],
    };

    if (filters && Object.keys(filters).length > 0) {
      Object.keys(filters).map((key) => {
        if (key === "created_at_before") {
          transformedFilters.date[1] = dayjs(filters.created_at_before).format(
            "MM/DD/YYYY",
          );
        }

        if (key === "created_at_after") {
          transformedFilters.date[0] = dayjs(filters.created_at_after).format(
            "MM/DD/YYYY",
          );
        }
        if (key === "expense_type__id") {
          if (filters.expense_type__id) {
            transformedFilters.expense_type__id =
              filters.expense_type__id.split(",");
          }
        }

        if (key === "request_status__id") {
          if (filters.request_status__id) {
            transformedFilters.request_status__id =
              filters.request_status__id.split(",");
          }
        }

        if (key === "request_type__id") {
          if (filters.request_type__id) {
            transformedFilters.request_type__id = filters.request_type__id
              .toString()
              .split(",");
          }
        }

        if (key === "client_id") {
          if (filters.client_id) {
            transformedFilters.client_id = filters.client_id
              .toString()
              .split(",");
          }
        }

        if (key === "hrbp_id") {
          if (filters.hrbp_id) {
            transformedFilters.hrbp_id = filters.hrbp_id.toString().split(",");
          }
        }
      });
      if (type === "finance") {
        transformedFilters.request_status__id = [];
      }

      setFilterViewState(transformedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleClear = () => {
    setFilterViewState(undefined);
    resetTableState();
  };

  return (
    <tr className="sticky top-12 z-[4] bg-white shadow-sm">
      <th
        colSpan={colSpan}
        className={classNames(
          filters &&
            Object.keys(filters).filter((a) =>
              type === "finance"
                ? a !== "page" && a !== "request_status__id"
                : a !== "page",
            ).length > 0
            ? "h-16 border-t px-4 opacity-100 first:px-0"
            : "h-0 p-0 opacity-0",
          "hidden overflow-hidden md:table-cell",
        )}
      >
        <div
          className={classNames(
            filters &&
              Object.keys(filters).filter((a) =>
                type === "finance"
                  ? a !== "page" && a !== "request_status__id"
                  : a !== "page",
              ).length > 0
              ? "h-16 px-4 opacity-100 first:px-0"
              : "h-0 p-0 opacity-0",
            "relative flex items-center justify-between gap-4 overflow-hidden transition-all ease-in-out",
          )}
        >
          <div className="flex items-center gap-2 px-4">
            <span className="font-bold text-neutral-900">Filters: </span>
            <div className="flex items-center gap-4 overflow-x-auto">
              {filters &&
                Object.keys(filters).filter((a) =>
                  type === "finance"
                    ? a !== "page" && a !== "request_status__id"
                    : a !== "page",
                ).length > 0 &&
                filterViewState &&
                Object.keys(filterViewState).map((key) => (
                  <div key={key}>
                    {filterViewState[key as keyof IFilters].length > 0 && (
                      <div
                        key={key}
                        className={classNames(
                          "flex items-center gap-2",
                          key === "client_id" && "w-96 overflow-x-auto py-1",
                        )}
                      >
                        {key === "request_status__id" &&
                          filterViewState.request_status__id.length > 0 && (
                            <MdLabel className="h-4 w-4 text-neutral-900" />
                          )}

                        {key === "request_type__id" &&
                          filterViewState.request_type__id.length > 0 && (
                            <MdAccessTimeFilled className="h-4 w-4 text-neutral-900" />
                          )}

                        {key === "client_id" &&
                          filterViewState.client_id.length > 0 && (
                            <MdGroup className="h-4 w-4 text-neutral-900" />
                          )}

                        {key === "hrbp_id" &&
                          filterViewState.hrbp_id.length > 0 && (
                            <MdGroup className="h-4 w-4 text-neutral-900" />
                          )}

                        {key === "expense_type__id" &&
                          filterViewState.expense_type__id.length > 0 && (
                            <HiCurrencyDollar className="h-4 w-4 text-neutral-900" />
                          )}

                        {key === "date" && filterViewState.date.length > 0 && (
                          <MdCalendarToday className="h-4 w-4 text-neutral-900" />
                        )}

                        {filterViewState[key as keyof IFilters].length > 0 && (
                          <div className="flex gap-2">
                            <span>
                              {key === "client_id" && (
                                <p
                                  key={key}
                                  className={classNames(
                                    "pl-2 text-sm text-neutral-800",
                                  )}
                                >
                                  {selectedClientsIsLoading
                                    ? "..."
                                    : selectedClients &&
                                        selectedClients.count >= 2
                                      ? `${selectedClients.count} Clients Selected`
                                      : selectedClients?.results?.map(
                                          (a) => a.name,
                                        )}
                                </p>
                              )}
                            </span>

                            <span>
                              {key === "hrbp_id" && (
                                <p
                                  key={key}
                                  className={classNames(
                                    "pl-2 text-sm text-neutral-800",
                                  )}
                                >
                                  {selectedHRBPSIsLoading
                                    ? "..."
                                    : selectedHRBPs && selectedHRBPs.count >= 2
                                      ? `${selectedHRBPs.count} HRBPs Selected`
                                      : selectedHRBPs?.results?.map(
                                          (a) =>
                                            `${a.first_name} ${a.last_name}`,
                                        )}
                                </p>
                              )}
                            </span>

                            {filterViewState[key as keyof IFilters]
                              .filter(
                                (key) =>
                                  key !== "client_id" && key !== "hrbp_id",
                              )
                              .map((value, i) => (
                                <span key={key + "-" + value}>
                                  {key === "request_status__id" && (
                                    <span className="ml-4 first:ml-0">
                                      {allStatusesIsLoading ? (
                                        "..."
                                      ) : (
                                        <StatusBadge
                                          key={value}
                                          status={
                                            allStatuses?.results
                                              .find((a) => a.id === +value)
                                              ?.name.toLowerCase() as StatusType
                                          }
                                        />
                                      )}
                                    </span>
                                  )}

                                  {key === "expense_type__id" && (
                                    <p
                                      key={value}
                                      className={classNames(
                                        i > 0 && "border-l",
                                        "pl-2 text-sm text-neutral-800",
                                      )}
                                    >
                                      {allExpenseTypesIsLoading
                                        ? "..."
                                        : allExpenseTypes?.results.find(
                                            (a) => a.id === +value,
                                          )?.name}
                                    </p>
                                  )}

                                  {key === "request_type__id" && (
                                    <p
                                      key={value}
                                      className="pl-2 text-sm text-neutral-800"
                                    >
                                      {requestTypesIsLoading
                                        ? "..."
                                        : requestTypes?.results.find(
                                            (a) => a.id === +value,
                                          )?.name}
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
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div className="absolute right-5">
            <Button
              aria-label="Clear All"
              buttonType="text"
              variant="danger"
              onClick={handleClear}
            >
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
