/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type CellContext } from "@tanstack/react-table";
import dayjs from "dayjs";
import React from "react";
import { type IUser } from "~/features/state/user-state.slice";
import { type ReimbursementRequestType } from "~/types/reimbursement.request-type";
import {
  type IParticularDetails,
  type IReimbursementRequest,
  type IStatus,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { Button } from "../../Button";
import StatusBadge, { type StatusType } from "../../StatusBadge";
import ExpenseTypeCell from "./ExpenseTypeCell";

const TableCell: React.FC<CellContext<IReimbursementRequest, unknown>> = (
  props,
) => {
  const nonPlainTextCells = [
    "Status",
    "Expense",
    "Type",
    "Total",
    "Filed",
    "Approved",
    "Name",
    "ID",
    "Client",
  ];

  return (
    <>
      {/*PLAIN TEXT COLUMNS */}
      {props.column.columnDef.header &&
        !nonPlainTextCells.includes(props.column.columnDef.header.toString()) &&
        props.getValue()}

      {/* STATUS */}
      {props.column.columnDef.header === "Status" && (
        <StatusBadge
          status={
            (props.getValue() as IStatus).name.toLowerCase() as StatusType
          }
        />
      )}

      {/* CLIENT NAME */}
      {props.column.columnDef.header === "Client" &&
        (props.getValue() as IUser).profile.organization}

      {/* REQUESTOR ID */}
      {props.column.columnDef.header === "ID" && (props.getValue() as IUser).id}

      {/* REQUESTOR NAME*/}
      {props.column.columnDef.header === "Name" && (
        <>
          {(props.getValue() as IUser).first_name}{" "}
          {(props.getValue() as IUser).last_name}
        </>
      )}
      {/* EXPENSE TYPE */}
      {props.column.columnDef.header === "Expense" && (
        <ExpenseTypeCell value={props.getValue() as IParticularDetails[]} />
      )}

      {/* REQUEST TYPES */}
      {props.column.columnDef.header === "Type" &&
        (props.getValue() as ReimbursementRequestType).name}

      {/* DATES */}
      {(props.column.columnDef.header === "Filed" ||
        props.column.columnDef.header === "Approved") &&
        dayjs(props.getValue() as string).format("MMM D, YYYY")}

      {/* AMOUNT */}
      {props.column.columnDef.header === "Total" &&
        currencyFormat(props.getValue() as number)}

      {/* VIEW BUTTON  */}
      {props.column.columnDef.id === "actions" &&
        props.column.columnDef.setFocusedReimbursementId &&
        props.column.columnDef.openDrawer && (
          <Button
            buttonType="text"
            onClick={() => {
              props.column.columnDef.setFocusedReimbursementId(
                props.getValue() as number,
              );
              props.column.columnDef.openDrawer();
            }}
          >
            View
          </Button>
        )}
    </>
  );
};

export default TableCell;
