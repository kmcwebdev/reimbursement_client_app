import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import {
  ParticularDetailsSchema,
  type ParticularDetails,
} from "~/schema/reimbursement-particulars.schema";

import AddAttachments from "./steps/AddAttachments";
import ParticularList from "./steps/ParticularList";
import SelectReimbursementType from "./steps/SelectReimbursementType";
import AddApprovers from "./steps/SetApprover";

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
  const {
    activeStep,
    particularDetailsFormIsVisible,
    activeParticularIndex,
    reimbursementFormValues,
  } = useAppSelector((state) => state.reimbursementForm);

  const useParticularDetailsFormReturn = useForm<ParticularDetails>({
    resolver: zodResolver(ParticularDetailsSchema),
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
        <AddAttachments formReturn={useParticularDetailsFormReturn} />
      )}

      {activeStep === 3 && (
        <AddApprovers formReturn={useParticularDetailsFormReturn} />
      )}
    </div>
  );
};

export default ReimburseForm;
