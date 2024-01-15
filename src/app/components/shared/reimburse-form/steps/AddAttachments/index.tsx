import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";
import Capture from "./Capture";
import MethodSelection from "./MethodSelection";
import UploadAttachments from "./UploadAttachments";

interface AttachmentProps {
  formReturn: UseFormReturn<ParticularDetails>;
}

const AddAttachments: React.FC<AttachmentProps> = ({ formReturn }) => {
  const { selectedAttachmentMethod } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  return (
    <div className="pt-4">
      {!selectedAttachmentMethod && <MethodSelection />}

      {selectedAttachmentMethod === "capture" && (
        <Capture formReturn={formReturn} />
      )}
      {selectedAttachmentMethod === "upload" && (
        <UploadAttachments formReturn={formReturn} />
      )}
    </div>
  );
};

export default AddAttachments;
