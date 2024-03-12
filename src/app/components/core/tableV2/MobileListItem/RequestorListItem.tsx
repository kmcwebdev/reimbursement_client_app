import React from "react";

import { type Particular } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import { type StatusType } from "../../StatusBadge";
import StatusDot from "../../StatusDot";
import ExpenseTypeCell from "../TableCell/ExpenseTypeCell";

interface RequestorListItemProps {
  reference_no: string;
  date: string;
  type: string;
  status: StatusType;
  particulars: Particular[];
  amount: string;
  onClick: () => void;
}

const RequestorListItem: React.FC<RequestorListItemProps> = ({
  reference_no,
  date,
  type,
  particulars,
  amount,
  status,
  onClick,
}) => {
  return (
    <div className="flex h-[120px] flex-col gap-4 p-4" onClick={onClick}>
      <div className="flex h-10 flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusDot status={status} />
            <p className="text-md font-bold">{reference_no}</p>
          </div>

          <p className="text-sm text-neutral-800">
            {parseTimezone(date).format("MMM DD,YYYY")}
          </p>
        </div>
        <p className="text-sm font-medium text-neutral-800">{type}</p>
      </div>
      <div className="flex divide-x">
        <div className="w-1/2">
          <ExpenseTypeCell value={particulars} tableType="reimbursements" />
        </div>
        <div className="w-1/2 text-right">{currencyFormat(+amount)}</div>
      </div>
    </div>
  );
};

export default RequestorListItem;
