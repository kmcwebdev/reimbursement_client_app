import dayjs from "dayjs";
import React from "react";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import { currencyFormat } from "~/utils/currencyFormat";
import List from "../core/List";

interface DetailsProps {
  statusDetails: StatusType;
  type: string;
  expense: string;
  filed: string;
  amount: number | string;
  remarks: string;
}

const Details: React.FC<DetailsProps> = ({
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

      {expense === "Others" && <List.Item label="Remarks" value={remarks} />}
      <List.Item label="Filed" value={dayjs(filed).format("MMM D,YYYY")} />
      <List.Item label="Amount" value={currencyFormat(+amount)} />

      <div className="flex flex-col">
        {(statusDetails === "processing" || statusDetails === "credited") && (
          <List.Item label="Payout" value={filed} />
        )}
      </div>
    </List>
  );
};

export default Details;
