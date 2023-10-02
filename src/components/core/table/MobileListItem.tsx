import { type Row } from "@tanstack/react-table";
import React from "react";
import {
  type ReimbursementApproval,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import StatusBadge, { type StatusType } from "../StatusBadge";
import Checkbox from "../form/fields/Checkbox";

interface MobileListItemProps {
  type: "approvals" | "default";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Row<ReimbursementRequest | ReimbursementApproval>;
}

const MobileListItem: React.FC<MobileListItemProps> = ({ type, row }) => {
  return (
    <div className="p-2">
      <div className="flex h-28 flex-col gap-4 rounded-md p-2">
        <div className="flex">
          <div className="w-6">
            <Checkbox name="checkbox" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
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
              <p className="text-center">{row.original.expense_type}</p>
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
