import React from "react";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import List from "../core/List";

interface DeatilsProps {
  statusDetails: StatusType;
  type: string;
  expense: string;
  remarks: string;
  filed: string;
  total: number;
}

const Details: React.FC<DeatilsProps> = ({
  statusDetails,
  type,
  expense,
  remarks,
  filed,
  total,
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
      <List.Item
        label={statusDetails === "credited" ? "Total" : "Amount"}
        value={total}
      />
      <List.Item
        label={statusDetails === "credited" ? "Total" : "Amount"}
        value={total}
      />

      <div className="flex flex-col">
        {(statusDetails === "processing" || statusDetails === "credited") && (
          <List.Item label="Payout" value={filed} />
        )}
      </div>
    </List>
  );
};

export default Details;
