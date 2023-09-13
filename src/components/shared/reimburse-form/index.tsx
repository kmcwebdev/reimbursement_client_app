import dynamic from "next/dynamic";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";

const ReimbursementDetailsForm = dynamic(
  () => import("./steps/ReimbursementDetailsForm"),
);
const UploadAttachments = dynamic(() => import("./steps/UploadAttachments"));

interface ReimburseFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formReturn: UseFormReturn<any>;
  handleOpenCancelDialog: () => void;
}

const ReimburseForm: React.FC<ReimburseFormProps> = ({
  formReturn,
  handleOpenCancelDialog,
}) => {
  const { activeStep } = useAppSelector((state) => state.reimbursementForm);

  return (
    <div className="py-4">
      {activeStep === 0 && formReturn && (
        <ReimbursementDetailsForm
          formReturn={formReturn}
          handleOpenCancelDialog={handleOpenCancelDialog}
        />
      )}
      {activeStep === 1 && <UploadAttachments formReturn={formReturn} />}
    </div>
  );
};

export default ReimburseForm;
