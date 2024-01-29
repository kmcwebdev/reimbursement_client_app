import { type Row } from "@tanstack/react-table";
import React from "react";
import { useAppSelector } from "~/app/hook";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
import { type StatusType } from "../../StatusBadge";
import ApproverListItem from "./ApproverListItem";
import RequestorListItem from "./RequestorListItem";

type MobileListItemProps = {
  onClick?: (e: number) => void;
  type: "reimbursements" | "history" | "finance" | "approvals" | "admin";
  row: Row<IReimbursementRequest>;
};

const MobileListItem: React.FC<MobileListItemProps> = (props) => {
  const { assignedRole } = useAppSelector((state) => state.session);

  return (
    <div>
      {props.type === "reimbursements" && (
        <RequestorListItem
          amount={props.row.original.total_amount}
          date={props.row.original.created_at}
          reference_no={props.row.original.reference_no}
          type={props.row.original.request_type.name}
          status={
            props.row.original.request_status.name.toLowerCase() as StatusType
          }
          particulars={props.row.original.particulars}
          onClick={() => props.onClick && props.onClick(props.row.original.id)}
        />
      )}

      {props.type !== "reimbursements" && (
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
                ? props.row.original.reimb_requestor.profile.organization
                : undefined
            }
            onClick={() =>
              props.onClick && props.onClick(props.row.original.id)
            }
          />
        </div>
      )}
      {/* <div
        className={classNames(
          selectedItems.includes(props.row.original.id) && "bg-orange-50",
          props.type === "approvals" || props.type === "admin"
            ? "h-32"
            : "h-28",
          "flex flex-col gap-4 rounded-md border-b p-4",
        )}
      >
        <div className="flex">
          

          <div className="flex flex-1 flex-col gap-1" {...pressHandler}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 divide-x">
                <StatusDot
                  status={
                    props.row.original.request_status.name.toLowerCase() as StatusType
                  }
                />

                <p className="pl-1 font-bold">
                  {props.row.original.reference_no}
                </p>
              </div>
              <p className="font-bold">
                {currencyFormat(+props.row.original.total_amount)}
              </p>
            </div>

            <div>
              <div className="flex justify-between">
                <p className=" text-neutral-900">
                  {props.row.original.reimb_requestor.first_name}{" "}
                  {props.row.original.reimb_requestor.last_name}
                </p>
                <p className=" text-neutral-800">
                  {parseTimezone(props.row.original.created_at).format(
                    "MMM DD,YYYY",
                  )}
                </p>
              </div>

              {(props.type === "approvals" || props.type === "admin") && (
                <p className="text-sm text-neutral-800">
                  {props.row.original.reimb_requestor.profile.organization ||
                    "ORGANIZATION"}
                </p>
              )}
            </div>

            <ExpenseTypeCell value={props.row.original.particulars} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default MobileListItem;