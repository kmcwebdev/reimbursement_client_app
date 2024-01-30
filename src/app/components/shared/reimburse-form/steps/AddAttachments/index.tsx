import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";
import Capture from "./Capture";
import MethodSelection from "./MethodSelection";
import UploadAttachments from "./UploadAttachments";

interface AttachmentProps {
  formReturn: UseFormReturn<ParticularDetails>;
  handleResetRequestType: () => void;
}

const AddAttachments: React.FC<AttachmentProps> = ({
  formReturn,
  handleResetRequestType,
}) => {
  const { selectedAttachmentMethod } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  return (
    <div className="pt-4">
      {!selectedAttachmentMethod && <MethodSelection />}

      {selectedAttachmentMethod === "capture" && (
        <Capture
          formReturn={formReturn}
          handleResetRequestType={handleResetRequestType}
        />
      )}
      {selectedAttachmentMethod === "upload" && (
        <UploadAttachments
          formReturn={formReturn}
          handleResetRequestType={handleResetRequestType}
        />
      )}
    </div>
  );
};

export default AddAttachments;
