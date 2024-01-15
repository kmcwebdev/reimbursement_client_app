import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import React, { useState } from "react";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdClose } from "react-icons-all-files/md/MdClose";
import {
  type IApproverMatrix,
  type IStatus,
} from "~/types/reimbursement.types";
import { parseTimezone } from "~/utils/parse-timezone";
dayjs.extend(timezone);
interface ApproversProps {
  approvers: IApproverMatrix[];
  request_status: IStatus;
}

const Approvers: React.FC<ApproversProps> = ({ approvers, request_status }) => {
  const [lastApproverRejected] = useState<IApproverMatrix>();

  // useMemo(() => {
  //   const approversWhoRejected = approvers.filter((a) => a.has_rejected);

  //   if (approversWhoRejected && approversWhoRejected.length > 0) {
  //     setLastApproverRejected(
  //       approversWhoRejected[approversWhoRejected.length - 1],
  //     );
  //   }
  // }, [approvers]);
  return (
    <>
      <div className="flex flex-col gap-4 py-4">
        <h6 className="text-base font-semibold">Approvers</h6>

        {approvers.map((approver) => (
          <div key={approver.id} className="flex flex-col gap-4">
            <div className="flex gap-4">
              {!approver.is_approved && !lastApproverRejected && (
                <MdAccessTimeFilled className="mt-0.1 h-4 w-4 text-yellow-600" />
              )}

              {lastApproverRejected &&
                lastApproverRejected.id !== approver.id && (
                  <MdClose className="h-4 w-4 text-neutral-600" />
                )}

              {approver.is_rejected && (
                <MdClose className="h-4 w-4 text-red-600" />
              )}

              {approver.is_approved && (
                <HiCheckCircle className="mt-0.1 h-4 w-4 text-green-600" />
              )}

              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm text-neutral-900">
                  {approver.display_name
                    ? approver.display_name
                    : `Approver ID: ${approver.id}`}
                </span>

                {approver.acknowledge_datetime ? (
                  <div className="flex justify-between">
                    <>
                      <p className="text-xs text-neutral-600">
                        {parseTimezone(approver.acknowledge_datetime).format(
                          "MMM D, YYYY",
                        )}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {parseTimezone(approver.acknowledge_datetime).format(
                          "hh:mm A",
                        )}
                      </p>
                    </>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-600">
                    Pending for Approval
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {request_status.name === "Approved" && (
          <div>
            <p className="text-sm text-neutral-800">
              Waiting for Payment Processing...
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Approvers;
