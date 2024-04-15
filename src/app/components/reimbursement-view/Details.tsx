import React from "react";
import StatusBadge, {
  type StatusType,
} from "~/app/components/core/StatusBadge";
import {
  type Particular,
  type RequestType,
  type Status,
  type User,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import List from "../core/List";

export interface DetailsProps {
  request_status: Status;
  request_type: RequestType;
  particulars: Particular[];
  reimb_requestor: User;
  created_at: string;
  amount: string;
  payroll_date: string;
}

const Details: React.FC<DetailsProps> = ({
  request_status,
  request_type,
  reimb_requestor,
  particulars,
  created_at,
  amount,
  payroll_date,
}) => {
  return (
    <List>
      <List.Item
        label="Status"
        value={
          <StatusBadge
            status={request_status.name.toLowerCase() as StatusType}
          />
        }
      />

      <List.Item
        label="Client"
        value={reimb_requestor.profile?.organization || "No Organization"}
      />
      <List.Item
        label="Name"
        value={`${reimb_requestor.first_name} ${reimb_requestor.last_name}`}
      />

      <List.Item
        label="Expense"
        value={
          <div className="inline-flex flex-wrap gap-1">
            {[
              ...new Set(particulars.map((item) => item.expense_type.name)),
            ].map((particular) => (
              <StatusBadge
                key={particular}
                status="default"
                label={particular}
              />
            ))}
          </div>
        }
      />

      <List.Item label="Type" value={request_type.name} />

      <List.Item
        label="Filed"
        value={parseTimezone(created_at).format("MMM D,YYYY")}
      />
      <List.Item label="Amount to be Reimbursed" value={currencyFormat(+amount)} />

      <div className="flex flex-col">
        {payroll_date && request_status.name === "Credited" && (
          <List.Item
            label="Payout"
            value={parseTimezone(payroll_date).format("MMMM DD,YYYY")}
          />
        )}
      </div>
    </List>
  );
};

export default Details;
