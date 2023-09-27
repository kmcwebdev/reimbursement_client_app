import { type Column } from "@tanstack/react-table";
import { useEffect, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { statusOptions } from "~/constants/status-options";
import { setApprovalTableFilters } from "~/features/approval-page-state-slice";
import { setReimbursementsTableFilters } from "~/features/reimbursement-request-page-slice";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import Popover from "../../Popover";
import StatusBadge, { type StatusType } from "../../StatusBadge";
import Checkbox from "../../form/fields/Checkbox";
export interface FilterProps {
  tableType: "reimbursements" | "approvals" | "finance";
  column: Column<ReimbursementRequest, unknown>;
}

const StatusFilter: React.FC<FilterProps> = ({ tableType }) => {
  const { filters: approvalPageFilters } = useAppSelector(
    (state) => state.approvalPageState,
  );

  const { filters: reimbursementsPageFilters } = useAppSelector(
    (state) => state.reimbursementRequestPageState,
  );

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
    if (tableType === "approvals") {
      dispatch(
        setApprovalTableFilters({
          ...approvalPageFilters,
          request_status_ids: checked.join(","),
        }),
      );
    }

    if (tableType === "reimbursements") {
      dispatch(
        setReimbursementsTableFilters({
          ...reimbursementsPageFilters,
          request_status_ids: checked.join(","),
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <Popover
      btn={
        <FaCaretDown
          className={classNames(
            // isButtonHidden && "hidden",
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
                // disabled={checked.length === 1 && checked.includes(option)}
                onChange={(e) => onChange(e, option)}
              />
            ))}

            {/* <CollapseHeightAnimation
              isVisible={checked.length < statusOptions.length}
            >
              <Button buttonType="text" onClick={showAll}>
                Show All
              </Button>
            </CollapseHeightAnimation> */}
          </div>
        </div>
      }
    />
  );
};

export default StatusFilter;
