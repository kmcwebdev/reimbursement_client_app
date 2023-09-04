import React from "react";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import List from "../core/List";

interface DeatilsProps {
  statusDetails: StatusType;
  type: string;
  expense: string;
  remarks: string;
  filed: string;
  amount: number | string;
}

const Details: React.FC<DeatilsProps> = ({
  statusDetails,
  type,
  expense,
  remarks,
  filed,
  amount,
}) => {
  return (
    <List>
      <List.Item
        label="Status"
        value={<StatusBadge status={statusDetails} />}
      />
      <List.Item label="Type" value={type} />
      <List.Item label="Expense" value={expense} />
      <List.Item label="Remarks" value={remarks} />
      <List.Item label="Filed" value={filed} />
      <List.Item label="Amount" value={amount} />

      <div className="flex flex-col">
        {(statusDetails === "processing" || statusDetails === "credited") && (
          <List.Item label="Payout" value={filed} />
        )}
      </div>
    </List>
  );
};

export default Details;
