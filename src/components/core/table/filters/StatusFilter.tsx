import { type Column } from "@tanstack/react-table";
import { useEffect, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { statusOptions } from "~/constants/status-options";
import { setPageTableFilters } from "~/features/page-state.slice";
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
        <div className="w-32 p-4">
          <div className="flex flex-col gap-2 capitalize">
            {statusOptions.map((option: string) => (
              <Checkbox
                key={option}
                label={
                  <StatusBadge status={option.toLowerCase() as StatusType} />
                }
                name={option}
                checked={checked.includes(option)}
                onChange={(e) => onChange(e, option)}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};

export default StatusFilter;
