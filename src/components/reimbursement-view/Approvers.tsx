import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdClose } from "react-icons-all-files/md/MdClose";
// import { MdClose } from "react-icons-all-files/md/MdClose";
import { Approvers } from "~/types/reimbursement.types";

interface ApproversProps {
  approvers: Approvers[];
}

const Approvers: React.FC<ApproversProps> = ({ approvers }) => {
  const [lastApproverRejected, setLastApproverRejected] = useState<Approvers>();

  useMemo(() => {
    const approversWhoRejected = approvers.filter((a) => a.has_rejected);

    if (approversWhoRejected && approversWhoRejected.length > 0) {
      setLastApproverRejected(
        approversWhoRejected[approversWhoRejected.length - 1],
      );
    }
  }, [approvers]);
  return (
    <>
      <div className="mt-3 flex flex-col gap-4">
        <h6 className="text-base font-semibold">Approvers</h6>

        {approvers.map((approver) => (
          <div
            key={approver.approval_matrix_id}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4">
              {!approver.has_rejected &&
                !approver.has_approved &&
                !lastApproverRejected && (
                  <MdAccessTimeFilled className="mt-0.1 h-4 w-4 text-yellow-600" />
                )}

              {lastApproverRejected &&
                lastApproverRejected.approver_id !== approver.approver_id && (
                  <MdClose className="h-4 w-4 text-neutral-600" />
                )}

              {approver.has_rejected && (
                <MdClose className="h-4 w-4 text-red-600" />
              )}

              {approver.has_approved && (
                <HiCheckCircle className="mt-0.1 h-4 w-4 text-green-600" />
              )}

              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm text-neutral-900">
                  {approver.approver_name
                    ? approver.approver_name
                    : `Approver ID: ${approver.approver_id}`}
                </span>

                {(approver.has_approved || approver.has_rejected) && (
                  <div className="flex justify-between">
                    <>
                      <p className="text-xs text-neutral-600">
                        {dayjs(approver.updated_at).format("MMM D, YYYY")}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {dayjs(approver.updated_at).format("hh:mm A")}
                      </p>
                    </>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Approvers;
