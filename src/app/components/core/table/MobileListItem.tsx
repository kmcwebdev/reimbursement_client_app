import { type Row } from "@tanstack/react-table";
import React, { type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setSelectedItems } from "~/features/state/table-state.slice";
import useLongAndShortPress from "~/hooks/use-press";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import StatusBadge, { type StatusType } from "../StatusBadge";
import Checkbox from "../form/fields/Checkbox";
import ExpenseTypeCell from "./TableCell/ExpenseTypeCell";

type MobileListItemProps = {
  onClick?: (e: number) => void;
  type: "reimbursements" | "history" | "finance" | "approvals";
  row: Row<IReimbursementRequest>;
};

const MobileListItem: React.FC<MobileListItemProps> = (props) => {
  const { selectedItems } = useAppSelector((state) => state.pageTableState);
  const { user } = useAppSelector((state) => state.session);

  const pressHandler = useLongAndShortPress(
    () =>
      props.type !== "reimbursements" && props.type !== "history"
        ? handleLongPress(props.row.original.id)
        : undefined,
    () =>
      props.onClick &&
      props.type !== "reimbursements" &&
      props.type !== "history"
        ? props.onClick(props.row.original.id)
        : undefined,
  );

  const dispatch = useAppDispatch();

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const value = +e.target.value;

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

  const handleLongPress = (e: number) => {
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
          selectedItems.includes(props.row.original.id) && "bg-orange-50",
          "flex h-28 flex-col gap-4 rounded-md p-4",
        )}
      >
        <div className="flex">
          {props.type !== "reimbursements" &&
            props.type === "history" &&
            user &&
            user.groups[0] === "REIMBURSEMENT_MANAGER" && (
              <div className="w-6">
                <Checkbox
                  name="checkbox"
                  value={props.row.original.id}
                  onChange={handleCheckboxChange}
                  checked={selectedItems.includes(props.row.original.id)}
                />
              </div>
            )}

          <div className="flex flex-1 flex-col gap-1" {...pressHandler}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 divide-x">
                <StatusBadge
                  label={props.row.original.request_status.name}
                  status={
                    props.row.original.request_status.name.toLowerCase() as StatusType
                  }
                />

                {props.type === "approvals" && (
                  <p className="pl-2 text-sm text-neutral-800">
                    {props.row.original.reimb_requestor.profile.organization ||
                      "ORGANIZATION"}
                  </p>
                )}
              </div>
              <p className="text-sm text-neutral-800">
                {parseTimezone(props.row.original.created_at).format(
                  "MMM DD,YYYY",
                )}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-neutral-900">
                  {props.row.original.reimb_requestor.first_name}{" "}
                  {props.row.original.reimb_requestor.last_name}
                </p>
                <p className="text-neutral-900">
                  {props.row.original.reference_no}
                </p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 divide-x text-sm text-neutral-800">
              <p>{props.row.original.request_type.name}</p>

              <ExpenseTypeCell value={props.row.original.particulars} />
              <p className="text-right">
                {currencyFormat(+props.row.original.total_amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileListItem;
