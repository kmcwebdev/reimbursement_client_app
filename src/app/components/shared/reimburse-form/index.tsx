import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import { particularDetailsSchema } from "~/schema/reimbursement-particulars.schema";
import { type ParticularDetails } from "~/types/reimbursement.types";
import AddAttachments from "./steps/AddAttachments";
import ParticularList from "./steps/ParticularList";
import SelectReimbursementType from "./steps/SelectReimbursementType";
import AddApprovers from "./steps/SetApprover";

interface ReimburseFormProps {
  formReturn: UseFormReturn<{
    request_type: number;
  }>;
  handleOpenCancelDialog: () => void;
}

const ReimburseForm: React.FC<ReimburseFormProps> = ({
  formReturn,
  handleOpenCancelDialog,
}) => {
  const {
    activeStep,
    particularDetailsFormIsVisible,
    activeParticularIndex,
    reimbursementFormValues,
  } = useAppSelector((state) => state.reimbursementForm);

  const useParticularDetailsFormReturn = useForm<ParticularDetails>({
    resolver: zodResolver(particularDetailsSchema),
    mode: "onChange",
    defaultValues: useMemo(() => {
      if (
        activeParticularIndex &&
        particularDetailsFormIsVisible &&
        reimbursementFormValues.particulars.length > 0 &&
        reimbursementFormValues.particulars[+activeParticularIndex]
      ) {
        return {
          ...reimbursementFormValues.particulars[+activeParticularIndex],
        };
      }
    }, [
      activeParticularIndex,
      particularDetailsFormIsVisible,
      reimbursementFormValues.particulars,
    ]),
  });

  const handleResetRequestType = () => {
    formReturn.reset();
  };

  return (
    <div>
      {activeStep === 0 && (
        <SelectReimbursementType
          formReturn={formReturn}
          handleOpenCancelDialog={handleOpenCancelDialog}
        />
      )}
      {activeStep === 1 && (
        <ParticularList
          handleOpenCancelDialog={handleOpenCancelDialog}
          formReturn={useParticularDetailsFormReturn}
        />
      )}

      {activeStep === 2 && (
        <AddAttachments
          formReturn={useParticularDetailsFormReturn}
          handleResetRequestType={handleResetRequestType}
        />
      )}

      {activeStep === 3 && (
        <AddApprovers
          formReturn={useParticularDetailsFormReturn}
          handleResetRequestType={() => formReturn.reset()}
        />
      )}
    </div>
  );
};

export default ReimburseForm;
