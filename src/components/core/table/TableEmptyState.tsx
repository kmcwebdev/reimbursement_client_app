import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdBrowserNotSupported } from "react-icons-all-files/md/MdBrowserNotSupported";
import EmptyState from "../EmptyState";

interface TableEmptyStateProps {
  type: "finance" | "approvals" | "reimbursements" | "no-results";
  colSpan: number;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({ type, colSpan }) => {
  return (
    <>
      {type !== "no-results" && (
        <tr>
          <td colSpan={colSpan} className="px-4 pt-4 md:px-0">
            <div>
              <div className="grid h-[40vh] place-items-center rounded-md bg-neutral-100 py-10">
                {type === "approvals" && (
                  <EmptyState
                    icon={MdBrowserNotSupported as IconType}
                    title="No Reimbursement Requests to Approve."
                    description="You have 0 pending approvals."
                  />
                )}

                {type === "reimbursements" && (
                  <EmptyState
                    icon={MdBrowserNotSupported as IconType}
                    title="No Pending Reimbursement Requests"
                    description={`Submit a reimbursement request by clicking the "Reimburse" button above the table.`}
                  />
                )}

                {type === "finance" && (
                  <EmptyState
                    icon={MdBrowserNotSupported as IconType}
                    title="No Reimbursement Requests"
                    description="You have 0 pending approvals."
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
          <td colSpan={length} className="pt-4">
            <div>
              <div className="grid h-[40vh] place-items-center rounded-md bg-neutral-100 py-10">
                <EmptyState
                  icon={MdBrowserNotSupported as IconType}
                  title="No Reimbursement Requests Available."
                  description="You may try to change your filter values to see records."
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
