import { type Column } from "@tanstack/react-table";
import { type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useAllStatusesQuery } from "~/features/api/references-api-slice";
import { setPageTableFilters } from "~/features/state/table-state.slice";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
import Popover from "../../Popover";
import StatusBadge, { type StatusType } from "../../StatusBadge";
import Checkbox from "../../form/fields/Checkbox";
export interface FilterProps {
  column: Column<IReimbursementRequest, unknown>;
}

const StatusFilter: React.FC<FilterProps> = () => {
  const { filters } = useAppSelector((state) => state.pageTableState);
  const dispatch = useAppDispatch();

  const { data: allStatuses, isLoading: allStatusesIsLoading } =
    useAllStatusesQuery({});

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: number) => {
    let request_status__name: string | undefined = "";
    const currentStatusFilters = filters.request_status__name;

    if (currentStatusFilters) {
      if (currentStatusFilters.split(",").includes(value.toString())) {
        const filtered = currentStatusFilters
          .split(",")
          .filter((a) => a !== value.toString());

        if (filtered.length === 0) {
          request_status__name = undefined;
        } else {
          request_status__name = filtered.join(",");
        }
      } else {
        request_status__name = currentStatusFilters + "," + value.toString();
      }
    } else {
      request_status__name = value.toString();
    }

    dispatch(
      setPageTableFilters({
        ...filters,
        page: undefined,
        request_status__name,
      }),
    );
  };

  return (
    <Popover
      btn={<FaCaretDown className="text-neutral-900 hover:text-neutral-800" />}
      content={
        <div className="flex flex-col">
          <div className="flex h-10 items-center border-b px-4 text-orange-600">
            Pick Status
          </div>
          <div className="w-40 bg-neutral-50 p-4">
            <div className="flex flex-col gap-2 capitalize">
              {!allStatusesIsLoading &&
                allStatuses &&
                allStatuses.results.length > 0 &&
                allStatuses.results.map((option) => (
                  <Checkbox
                    key={option.id}
                    label={
                      <StatusBadge
                        status={option.name.toLowerCase() as StatusType}
                      />
                    }
                    name={option.name}
                    checked={filters.request_status__name
                      ?.split(",")
                      .includes(option.id.toString())}
                    onChange={(e) => onChange(e, option.id)}
                  />
                ))}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default StatusFilter;
