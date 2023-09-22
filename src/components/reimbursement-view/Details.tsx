import dayjs from "dayjs";
import React from "react";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import { currencyFormat } from "~/utils/currencyFormat";
import List from "../core/List";

export interface DetailsProps {
  requestor_request_status: string;
  request_type: string;
  expense_type: string;
  created_at: string;
  amount: number | string;
  remarks: string;
  user?: string;
  hrbp_request_status: string;
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
  // hrbp_request_status,
  finance_request_status
}) => {

  // const [ currentStatus, setCurrentStatus ] = useState<string>();

  // useEffect(() => {

  //   if (user === 'Member' && request_type === 'Scheduled' && requestor_request_status !== 'Cancelled') {
  //     setCurrentStatus(hrbp_request_status)
  //   } else if ( user === 'Member' && request_type === 'Scheduled' && requestor_request_status === 'Cancelled') {
  //     setCurrentStatus(requestor_request_status)
  //   } else if ( user === 'Member' && request_type === 'Scheduled' && requestor_request_status === 'Pending' && hrbp_request_status === 'Pending' ) {
  //     setCurrentStatus(requestor_request_status)
  //   } else if ( user === 'Member' && request_type === 'Unscheduled' && requestor_request_status === 'Cancelled' ) {
  //     setCurrentStatus(requestor_request_status)
  //   } else if ( user === 'Member' && request_type === 'Unscheduled' && requestor_request_status === 'Cancelled' ) {
  //     setCurrentStatus(requestor_request_status)
  //   }

  // console.log(request_type);

  // }, [currentStatus, hrbp_request_status, request_type, requestor_request_status, user])



  return (
    <List>
      {user && user !== 'Finance' && (
        <List.Item
          label="Status"
          value={
            <StatusBadge status={finance_request_status.toLowerCase() as StatusType} />
          }
        />
      )}
      {user && user === 'Finance' && (
        <List.Item
          label="Status"
          value={
            <StatusBadge status={finance_request_status.toLowerCase() as StatusType} />
          }
        />
      )}
      <List.Item label="Type" value={request_type} />
      <List.Item label="Expense" value={expense_type} />

      {expense_type === "Others" && (
        <List.Item label="Remarks" value={remarks} />
      )}
      <List.Item label="Filed" value={dayjs(created_at).format("MMM D,YYYY")} />
      <List.Item label="Amount" value={currencyFormat(+amount)} />

      <div className="flex flex-col">
        {(requestor_request_status === "Processing" || requestor_request_status === "Credited") && (
          <List.Item label="Payout" value={created_at} />
        )}
      </div>
    </List>
  );
};

export default Details;
