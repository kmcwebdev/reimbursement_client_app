import { type Column } from "@tanstack/react-table";
import { useEffect, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setPageTableFilters } from "~/features/page-state.slice";
import { useAllStatusesQuery } from "~/features/reimbursement-api-slice";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import Popover from "../../Popover";
import StatusBadge, { type StatusType } from "../../StatusBadge";
import Checkbox from "../../form/fields/Checkbox";
export interface FilterProps {
  column: Column<ReimbursementRequest, unknown>;
}

const StatusFilter: React.FC<FilterProps> = () => {
  const { filters } = useAppSelector((state) => state.pageTableState);
  const dispatch = useAppDispatch();

  const { data: allStatuses, isLoading: allStatusesIsLoading } =
    useAllStatusesQuery({});
  const [checked, setChecked] = useState<string[]>([]);

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    if (checked.includes(value)) {
      setChecked(checked.filter((a) => a !== value));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setChecked([...checked, value]);
    }
  };

  useEffect(() => {
    const request_status_ids =
      checked.length > 0 ? checked.join(",") : undefined;

    dispatch(
      setPageTableFilters({
        ...filters,
        request_status_ids,
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

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
                allStatuses.map((option) => (
                  <Checkbox
                    key={option.request_status_id}
                    label={
                      <StatusBadge
                        status={
                          option.request_status.toLowerCase() as StatusType
                        }
                      />
                    }
                    name={option.request_status}
                    checked={filters.request_status_ids?.includes(
                      option.request_status_id,
                    )}
                    onChange={(e) => onChange(e, option.request_status_id)}
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
