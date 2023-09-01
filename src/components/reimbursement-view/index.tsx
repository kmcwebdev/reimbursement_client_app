import { type PropsWithChildren } from "react";
import { Button } from "~/components/core/Button";
import { type StatusType } from "~/components/core/StatusBadge";
import Approvers from "./Approvers";
import Attachments from "./Attachments";
import Details from "./Details";
import Notes from "./Notes";

export type Reimbursement = {
  status: StatusType;
  client: string;
  id: string;
  name: string;
  reimbursementId: string;
  type: string;
  expense: string;
  remarks: string;
  filed: string;
  total: number;
  approvers: string;
  note: string;
  attachments: string;
  daterejected: string;
  notes: string;
};

export interface ReimbursementsCardViewProps extends PropsWithChildren {
  data: Reimbursement;
  closeDrawer: () => void;
}

const ReimbursementsCardView: React.FC<ReimbursementsCardViewProps> = ({
  closeDrawer,
  data,
}) => {
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="flex-1 p-5">
        <Details
          statusDetails={data.status}
          type={data.type}
          expense={data.expense}
          remarks={data.remarks}
          filed={data.filed}
          total={data.total}
        />

        {data.status === "rejected" && <Notes note={data.note} />}

        <Approvers
          status={data.status}
          approvers={data.approvers}
          daterejected={data.daterejected}
        />

        <Attachments attachments={data.attachments} />
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
    </div>
  );
};

export default ReimbursementsCardView;
