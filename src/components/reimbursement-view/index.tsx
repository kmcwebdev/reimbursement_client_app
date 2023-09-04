import { type PropsWithChildren } from "react";
import { Button } from "~/components/core/Button";
import { type StatusType } from "~/components/core/StatusBadge";
import { ReimbursementRequest } from "~/types/reimbursement.types";
import Approvers from "./Approvers";
import Attachments from "./Attachments";
import Details from "./Details";
import Notes from "./Notes";

export interface ReimbursementsCardViewProps extends PropsWithChildren {
  isLoading?: boolean;
  data?: ReimbursementRequest;
  closeDrawer: () => void;
}

const ReimbursementsCardView: React.FC<ReimbursementsCardViewProps> = ({
  closeDrawer,
  data,
}) => {
  return (
    <div className="relative flex h-full w-full flex-col">
      {data && (
        <>
          <div className="flex-1 p-5">
            <Details
              statusDetails={data.request_status.toLowerCase() as StatusType}
              type={data.request_type}
              expense={data.expense_type}
              remarks="Missing details"
              filed="Missing details"
              amount={data.amount}
            />

            {data.request_status === "rejected" && (
              <Notes note="Missing details" />
            )}

            <Approvers
              status={data.request_status}
              approvers="Missing details"
              daterejected="Missing details"
            />

            <Attachments attachments="Missing details" />
          </div>

          <div className="absolute bottom-0 grid h-[72px] w-full grid-cols-2 items-center justify-center gap-2 border-t border-neutral-300 px-5">
            <Button
              onClick={closeDrawer}
              className="w-full"
              buttonType="outlined"
              variant="neutral"
            >
              Back
            </Button>
            <Button className="w-full" variant="danger">
              Cancel Request
            </Button>
          </div>
        </>
      )}
      {/* TO DOs */}
      {/* ADD EMPTY STATE IF NO DATA */}
      {/* ADD LOADER IF LOADING */}
    </div>
  );
};

export default ReimbursementsCardView;
