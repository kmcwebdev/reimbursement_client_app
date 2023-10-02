import { type Row } from "@tanstack/react-table";
import React, { type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setSelectedItems } from "~/features/page-state.slice";
import useLongAndShortPress from "~/hooks/use-press";
import {
  type ReimbursementApproval,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import StatusBadge, { type StatusType } from "../StatusBadge";
import Checkbox from "../form/fields/Checkbox";

interface MobileListItemProps {
  type: "approvals" | "reimbursements" | "finance" | "history";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Row<ReimbursementRequest | ReimbursementApproval>;
  onClick?: (e: string) => void;
}

const MobileListItem: React.FC<MobileListItemProps> = ({
  type,
  row,
  onClick,
}) => {
  const { selectedItems } = useAppSelector((state) => state.pageTableState);

  const pressHandler = useLongAndShortPress(
    () =>
      type !== "reimbursements"
        ? handleLongPress(row.original.reimbursement_request_id)
        : undefined,
    () =>
      onClick ? onClick(row.original.reimbursement_request_id) : undefined,
  );

  const dispatch = useAppDispatch();

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const value = e.target.value;

    if (checked) {
      if (!selectedItems.includes(value)) {
        dispatch(setSelectedItems([...selectedItems, value]));
      }
    } else {
      if (selectedItems.includes(value)) {
        const updated = selectedItems.filter((item) => item !== value);
        dispatch(setSelectedItems([...updated]));
      }
    }
  };

  const handleLongPress = (e: string) => {
    if (selectedItems.includes(e)) {
      const updated = selectedItems.filter((item) => item !== e);
      dispatch(setSelectedItems([...updated]));
    } else {
      dispatch(setSelectedItems([...selectedItems, e]));
    }
  };

  return (
    <div>
      <div
        className={classNames(
          selectedItems.includes(row.original.reimbursement_request_id) &&
            "bg-orange-50",
          "flex h-28 flex-col gap-4 rounded-md p-4",
        )}
      >
        <div className="flex">
          {type !== "reimbursements" && (
            <div className="w-6">
              <Checkbox
                name="checkbox"
                value={row.original.reimbursement_request_id}
                onChange={handleCheckboxChange}
                checked={selectedItems.includes(
                  row.original.reimbursement_request_id,
                )}
              />
            </div>
          )}

          <div
            className="flex flex-1 flex-col gap-1"
            {...pressHandler}
            // onClick={() =>
            //   onClick
            //     ? onClick(row.original.reimbursement_request_id)
            //     : undefined
            // }
            // onMouseDown={() =>
            //   handleDrag(row.original.reimbursement_request_id)
            // }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 divide-x">
                <StatusBadge
                  label={row.original.requestor_request_status}
                  status={
                    row.original.requestor_request_status.toLowerCase() as StatusType
                  }
                />

                {type === "approvals" && (
                  <p className="pl-2 text-sm text-neutral-800">
                    {row.original.client_name}
                  </p>
                )}
              </div>
              <p className="text-sm text-neutral-800">
                {parseTimezone(row.original.created_at).format("MMM DD,YYYY")}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-neutral-900">{row.original.full_name}</p>
                <p className="text-neutral-900">{row.original.reference_no}</p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 divide-x text-sm text-neutral-800">
              <p>{row.original.request_type}</p>
              <p className="w-24 truncate px-2 text-center">
                {row.original.expense_type}
              </p>
              <p className="text-right">
                {currencyFormat(+row.original.amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileListItem;
