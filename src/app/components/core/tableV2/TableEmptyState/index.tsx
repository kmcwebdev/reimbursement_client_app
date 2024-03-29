import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdBrowserNotSupported } from "react-icons-all-files/md/MdBrowserNotSupported";
import EmptyState from "../../EmptyState";

interface TableEmptyStateProps {
  type:
    | "finance"
    | "approval"
    | "reimbursement"
    | "no-results"
    | "history"
    | "admin";
  colSpan: number;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({ type, colSpan }) => {
  return (
    <>
      {type !== "no-results" && (
        <tr>
          <td colSpan={colSpan} className="p-4 md:p-0">
            <div>
              <div className="grid h-[40vh] place-items-center rounded-md bg-neutral-100 py-10">
                {type === "approval" && (
                  <EmptyState
                    icon={MdBrowserNotSupported as IconType}
                    title="No Reimbursement Requests to Approve."
                    description="You have 0 pending approvals."
                  />
                )}

                {type === "reimbursement" && (
                  <EmptyState
                    icon={MdBrowserNotSupported as IconType}
                    title="No Pending Reimbursement Requests"
                    description={`Submit a reimbursement request by clicking the "Reimburse" button above the table.`}
                  />
                )}

                {type === "history" && (
                  <EmptyState
                    icon={MdBrowserNotSupported as IconType}
                    title="No Reimbursement Requests History"
                    description={`Reimbursement History is Empty.`}
                  />
                )}

                {type === "finance" && (
                  <EmptyState
                    icon={MdBrowserNotSupported as IconType}
                    title="No Reimbursement Requests"
                    description="You have 0 pending approvals."
                  />
                )}

                {type === "admin" && (
                  <EmptyState
                    icon={MdBrowserNotSupported as IconType}
                    title="No Reimbursement Requests"
                    description="Reimbursement is empty."
                  />
                )}
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Filter returns 0 record */}
      {type === "no-results" && (
        <tr>
          <td colSpan={colSpan} className="p-4 md:p-0">
            <div>
              <div className="grid h-[40vh] place-items-center rounded-md bg-neutral-100 py-10">
                <EmptyState
                  icon={MdBrowserNotSupported as IconType}
                  title="No Reimbursement Requests Available."
                  description="Try to change your filter values to see records."
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default TableEmptyState;
