/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type CellContext } from "@tanstack/react-table";
import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  openSideDrawer,
  setFocusedReimbursementId,
} from "~/features/state/table-state.slice";
import {
  type ApproverMatrix,
  type Particular,
  type ReimbursementRequest,
  type RequestType,
  type Status,
  type User,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { parseTimezone } from "~/utils/parse-timezone";
import { Button } from "../../Button";
import StatusBadge, { type StatusType } from "../../StatusBadge";
import ExpenseTypeCell from "./ExpenseTypeCell";

const TableCell: React.FC<CellContext<ReimbursementRequest, unknown>> = (
  props,
) => {
  const { user } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();

  const nonPlainTextCells = [
    "Status",
    "Expense",
    "Type",
    "Total",
    "Filed",
    "Approved",
    "Name",
    "E-ID",
    "Client",
  ];

  const getHRBPAcknowledgeDate = (value: ApproverMatrix[]) => {
    const hrbpApprover = value.find((a) => a.display_name === "HRBP");

    if (hrbpApprover) {
      return hrbpApprover.acknowledge_datetime;
    }
    return "";
  };

  return (
    <>
      {/*PLAIN TEXT COLUMNS */}
      {props.column.columnDef.header &&
        !nonPlainTextCells.includes(props.column.columnDef.header.toString()) &&
        props.getValue()}

      {/* STATUS */}
      {props.column.columnDef.header === "Status" &&
        props.column.columnDef.id !== "approver_matrix" && (
          <StatusBadge
            status={
              (props.getValue() as Status).name.toLowerCase() as StatusType
            }
          />
        )}

      {props.column.columnDef.header === "Status" &&
        props.column.columnDef.id === "approver_matrix" && (
          <>
            {props.row.original.request_status.name === "Pending" &&
              (props.getValue() as ApproverMatrix[]).find(
                (a) =>
                  a.display_name.toLowerCase() ===
                    user?.groups[0].split("_")[1].toLowerCase() &&
                  a.approval_status,
              ) && (
                <StatusBadge
                  status={
                    (props.getValue() as ApproverMatrix[])
                      .find(
                        (a) =>
                          a.display_name.toLowerCase() ===
                          user?.groups[0].split("_")[1].toLowerCase(),
                      )
                      ?.approval_status.name.toLowerCase() as StatusType
                  }
                />
              )}

            {props.row.original.request_status.name !== "Pending" && (
              <StatusBadge
                status={
                  props.row.original.request_status.name.toLowerCase() as StatusType
                }
              />
            )}
          </>
        )}

      {/* CLIENT NAME */}
      {props.column.columnDef.header === "Client" &&
        (props.getValue() as User)?.profile?.organization}

      {/* REQUESTOR ID */}
      {props.column.columnDef.header === "E-ID" &&
        (props.getValue() as User).profile?.employee_id}

      {/* REQUESTOR NAME*/}
      {props.column.columnDef.header === "Name" && (
        <>
          {(props.getValue() as User)?.first_name}{" "}
          {(props.getValue() as User)?.last_name}
        </>
      )}
      {/* EXPENSE TYPE */}
      {props.column.columnDef.header === "Expense" && (
        <ExpenseTypeCell value={props.getValue() as Particular[]} />
      )}

      {/* REQUEST TYPES */}
      {props.column.columnDef.header === "Type" &&
        (props.getValue() as RequestType).name}

      {/* DATES */}
      {props.column.columnDef.header === "Filed" &&
        parseTimezone(props.getValue() as string).format("MMM D, YYYY")}

      {props.column.columnDef.header === "Approved" &&
        parseTimezone(
          getHRBPAcknowledgeDate(props.row.original.approver_matrix),
        ).format("MMM D, YYYY")}

      {/* AMOUNT */}
      {props.column.columnDef.header === "Total" &&
        currencyFormat(props.getValue() as number)}

      {/* VIEW BUTTON  */}
      {props.column.columnDef.id === "actions" && (
        <Button
          aria-label="View"
          buttonType="text"
          onClick={() => {
            dispatch(setFocusedReimbursementId(props.getValue() as number));
            dispatch(openSideDrawer());
          }}
        >
          View
        </Button>
      )}
    </>
  );
};

export default TableCell;
