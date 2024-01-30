import React, { type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setSelectedItems } from "~/features/state/table-state.slice";
import { type IParticularDetails } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import { type StatusType } from "../../StatusBadge";
import StatusDot from "../../StatusDot";
import Checkbox from "../../form/fields/Checkbox";
import ExpenseTypeCell from "../TableCell/ExpenseTypeCell";

interface ApproverListItemProps {
  id: number;
  requestorName: string;
  reference_no: string;
  date: string;
  type: string;
  status: StatusType;
  particulars: IParticularDetails[];
  client?: string;
  amount: string;
  onClick: () => void;
}

const ApproverListItem: React.FC<ApproverListItemProps> = ({
  id,
  reference_no,
  requestorName,
  date,
  type,
  particulars,
  amount,
  status,
  client,
  onClick,
}) => {
  const dispatch = useAppDispatch();
  const { selectedItems } = useAppSelector((state) => state.pageTableState);

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

  return (
    <div className={classNames(client ? "h-[140px]" : "h-[120px]", "p-1")}>
      <div
        className={classNames(
          selectedItems.includes(id) && "bg-orange-100",
          "flex h-full rounded-md p-2",
        )}
      >
        <div className="w-6">
          <Checkbox
            name="checkbox"
            value={id}
            onChange={handleCheckboxChange}
            checked={selectedItems.includes(id)}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between" onClick={onClick}>
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot status={status} />
                <p className="text-md font-bold">{requestorName}</p>
              </div>

              <p className="text-sm text-neutral-800">
                {parseTimezone(date).format("MMM DD,YYYY")}
              </p>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-neutral-900">
                {reference_no}
              </p>
              {client && <p className="text-sm text-neutral-800">{client}</p>}
            </div>
          </div>
          <div className="flex divide-x">
            <div className="w-[28%] text-neutral-800">{type}</div>
            <div className="block w-[44%] px-2">
              <ExpenseTypeCell value={particulars} />
            </div>
            <div className="w-[28%] text-right">{currencyFormat(+amount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproverListItem;
