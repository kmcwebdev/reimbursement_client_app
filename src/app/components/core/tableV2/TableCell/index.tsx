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
import Popover from "../../Popover";
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
    "Assigned HRBP/s",
  ];

  const getHRBPAcknowledgeDate = (value: ApproverMatrix[]) => {
    const hrbpApprover = value.find((a) => a.display_name === "HRBP");

    if (hrbpApprover) {
      return hrbpApprover.acknowledge_datetime;
    }
    return "";
  };

  const getHrbps = () => {
    const requestor = props.getValue() as User;
    if (requestor) {
      const hrbps = requestor.profile?.hrbps;

      if (hrbps) {
        if (hrbps.length > 1) {
          return (
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-neutral-500 px-1 py-0.5">
                {hrbps[0].full_name}
              </span>

              <Popover
                ariaLabel="hrbp"
                btn={
                  <span className="cursor-pointer rounded-md border border-neutral-500 px-1 py-1 transition-all ease-in-out hover:text-orange-600">
                    + {hrbps.length - 1}
                  </span>
                }
                panelClassName="left-0 top-5"
                content={
                  <div className="relative w-52">
                    <div className="flex flex-col gap-4 p-4">
                      {hrbps.map((hrbp) => (
                        <p key={hrbp.email}>{hrbp.full_name}</p>
                      ))}
                    </div>
                  </div>
                }
              />
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-2">
              {hrbps.map((hrbp) => (
                <span
                  key={hrbp.email}
                  className="rounded-md border border-neutral-500 px-1 py-0.5"
                >
                  {hrbp.full_name}
                </span>
              ))}
            </div>
          );
        }
      }
    }
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

      {/* REQUESTOR HRBPs*/}
      {props.column.columnDef.header === "Assigned HRBP/s" && (
        <div className="flex gap-2">{getHrbps()}</div>
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
