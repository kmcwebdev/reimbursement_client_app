import React from "react";
import StatusBadge, {
  type StatusType,
} from "~/app/components/core/StatusBadge";
import { type IUser } from "~/features/state/user-state.slice";
import { type ReimbursementRequestType } from "~/types/reimbursement.request-type";
import {
  type IParticularDetails,
  type IStatus,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import List from "../core/List";

export interface DetailsProps {
  request_status: IStatus;
  request_type: ReimbursementRequestType;
  particulars: IParticularDetails[];
  reimb_requestor: IUser;
  created_at: string;
  amount: string;
}

const Details: React.FC<DetailsProps> = ({
  request_status,
  request_type,
  reimb_requestor,
  particulars,
  created_at,
  amount,
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
        value={reimb_requestor.profile.organization || "Client Missing"}
      />
      <List.Item
        label="Name"
        value={`${reimb_requestor.first_name} ${reimb_requestor.last_name}`}
      />

      <List.Item
        label="Expense"
        value={
          <div className="inline-flex flex-wrap gap-1">
            {particulars.map((particular) => (
              <StatusBadge
                key={particular.id}
                status="default"
                label={particular.expense_type.name}
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
      <List.Item label="Amount" value={currencyFormat(+amount)} />

      <div className="flex flex-col">
        {(request_status.name === "Processing" ||
          request_status.name === "Credited") && (
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
