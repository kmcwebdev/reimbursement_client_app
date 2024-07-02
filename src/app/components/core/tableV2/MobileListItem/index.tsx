import { type Row } from "@tanstack/react-table";
import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  openSideDrawer,
  setFocusedReimbursementId,
} from "~/features/state/table-state.slice";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { type TableType } from "..";
import { type StatusType } from "../../StatusBadge";
import ApproverListItem from "./ApproverListItem";
import RequestorListItem from "./RequestorListItem";

type MobileListItemProps = {
  onClick?: (e: number) => void;
  type: TableType;
  row: Row<ReimbursementRequest>;
  selectedItems?: number[];
  setSelectedItems?: (e: number[]) => void;
};

const MobileListItem: React.FC<MobileListItemProps> = (props) => {
  const { assignedRole } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();

  const handleClick = (e: number) => {
    dispatch(setFocusedReimbursementId(e));
    dispatch(openSideDrawer());
  };

  return (
    <div>
      {props.type === "reimbursement" && (
        <RequestorListItem
          amount={props.row.original.total_amount}
          date={props.row.original.created_at}
          reference_no={props.row.original.reference_no}
          type={props.row.original.request_type.name}
          status={
            props.row.original.request_status.name.toLowerCase() as StatusType
          }
          particulars={props.row.original.particulars}
          onClick={() => handleClick(props.row.original.id)}
        />
      )}

      {props.type !== "reimbursement" && (
        <div>
          <ApproverListItem
            id={props.row.original.id}
            requestorName={`${props.row.original.reimb_requestor.first_name} ${props.row.original.reimb_requestor.last_name}`}
            amount={props.row.original.total_amount}
            date={props.row.original.created_at}
            reference_no={props.row.original.reference_no}
            type={props.row.original.request_type.name}
            status={
              props.row.original.request_status.name.toLowerCase() as StatusType
            }
            particulars={props.row.original.particulars}
            client={
              assignedRole === "REIMBURSEMENT_HRBP" ||
              assignedRole === "REIMBURSEMENT_FINANCE"
                ? props.row.original.reimb_requestor.profile?.organization
                : undefined
            }
            selectedItems={props.selectedItems}
            setSelectedItems={props.setSelectedItems}
            onClick={() => handleClick(props.row.original.id)}
          />
        </div>
      )}
    </div>
  );
};

export default MobileListItem;
