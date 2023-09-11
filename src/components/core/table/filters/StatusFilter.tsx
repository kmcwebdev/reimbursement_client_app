import { type Column } from "@tanstack/react-table";
import { useEffect, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { statusOptions } from "~/constants/status-options";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { Button } from "../../Button";
import Popover from "../../Popover";
import StatusBadge, { type StatusType } from "../../StatusBadge";
import Checkbox from "../../form/fields/Checkbox";
export interface FilterProps {
  column: Column<ReimbursementRequest, unknown>;
  isButtonHidden?: boolean;
}

const StatusFilter: React.FC<FilterProps> = ({
  column,
  isButtonHidden = false,
}) => {
  useEffect(() => {
    column.setFilterValue(statusOptions);
  }, [column]);

  useEffect(() => {
    if (column.getFilterValue()) {
      setChecked(column.getFilterValue() as string[]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFilterValue()]);

  const [checked, setChecked] = useState(statusOptions);

  /**
   * Resets the status options
   *
   */
  useEffect(() => {
    if (checked.length === statusOptions.length) {
      column.setFilterValue(statusOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    if (checked.includes(value)) {
      setChecked(checked.filter((a) => a !== value));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setChecked([...checked, value]);
    }
    if (e.target.checked) {
      column.setFilterValue((old: string[]) =>
        old ? [...old, value] : [value],
      );
    } else {
      column.setFilterValue((old: string[]) =>
        old ? old.filter((a) => a !== value) : undefined,
      );
    }
  };

  const showAll = () => {
    setChecked(statusOptions);
    column.setFilterValue(statusOptions);
  };

  return (
    <Popover
      btn={
        <FaCaretDown
          className={classNames(
            isButtonHidden && "hidden",
            "text-neutral-900 hover:text-neutral-800",
          )}
        />
      }
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
                disabled={checked.length === 1 && checked.includes(option)}
                onChange={(e) => onChange(e, option)}
              />
            ))}

            <CollapseHeightAnimation
              isVisible={checked.length < statusOptions.length}
            >
              <Button buttonType="text" onClick={showAll}>
                Show All
              </Button>
            </CollapseHeightAnimation>
          </div>
        </div>
      }
    />
  );
};

export default StatusFilter;
