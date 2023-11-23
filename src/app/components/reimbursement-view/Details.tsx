import React from "react";
import StatusBadge, { type StatusType } from "~/app/components/core/StatusBadge";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import List from "../core/List";

export interface DetailsProps {
  requestor_request_status: string;
  request_type: string;
  expense_type: string;
  created_at: string;
  amount: number | string;
  remarks: string;
  user?: string;
  finance_request_status: string;
}

const Details: React.FC<DetailsProps> = ({
  requestor_request_status,
  request_type,
  expense_type,
  remarks,
  created_at,
  amount,
  user,
  finance_request_status,
}) => {
  return (
    <List>
      {user && user !== "Finance" && (
        <List.Item
          label="Status"
          value={
            <StatusBadge
              status={finance_request_status.toLowerCase() as StatusType}
            />
          }
        />
      )}
      {user && user === "Finance" && (
        <List.Item
          label="Status"
          value={
            <StatusBadge
              status={finance_request_status.toLowerCase() as StatusType}
            />
          }
        />
      )}
      <List.Item label="Type" value={request_type} />
      <List.Item label="Expense" value={expense_type} />

      {expense_type === "Others" && (
        <List.Item label="Remarks" value={remarks} />
      )}
      <List.Item
        label="Filed"
        value={parseTimezone(created_at).format("MMM D,YYYY")}
      />
      <List.Item label="Amount" value={currencyFormat(+amount)} />

      <div className="flex flex-col">
        {(requestor_request_status === "Processing" ||
          requestor_request_status === "Credited") && (
          <List.Item
            label="Payout"
            value={parseTimezone(created_at).format("MMMM DD,YYYY")}
          />
        )}
      </div>
    </List>
  );
};

export default Details;
