import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import AddParticulars from "./steps/AddParticulars";
import SelectReimbursementType from "./steps/SelectReimbursementType";

// const UploadAttachments = dynamic(() => import("./steps/UploadAttachments"));

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
    <div>
      {activeStep === 0 && (
        <SelectReimbursementType
          formReturn={formReturn}
          handleOpenCancelDialog={handleOpenCancelDialog}
        />
      )}
      {activeStep === 1 && (
        <AddParticulars handleOpenCancelDialog={handleOpenCancelDialog} />
      )}
    </div>
  );
};

export default ReimburseForm;
