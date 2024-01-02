import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import {
  ReimbursementParticularDetailsSchema,
  type ReimbursementParticularDetails,
} from "~/schema/reimbursement-particulars.schema";
import Capture from "./Capture";
import ParticularDetails from "./ParticularDetails";
import SelectAttachmentMethod from "./SelectAttachmentMethod";
import UploadAttachment from "./UploadAttachment";

const ParticularForm: React.FC = () => {
  const {
    activeParticularStep,
    activeParticularIndex,
    reimbursementFormValues,
  } = useAppSelector((state) => state.reimbursementForm);

  const useReimbursementParticularDetailsFormReturn =
    useForm<ReimbursementParticularDetails>({
      resolver: zodResolver(ReimbursementParticularDetailsSchema),
      mode: "onChange",
      defaultValues: useMemo(() => {
        if (
          activeParticularIndex &&
          activeParticularStep === "details" &&
          reimbursementFormValues.particulars.length > 0 &&
          reimbursementFormValues.particulars[+activeParticularIndex]
        ) {
          return {
            ...reimbursementFormValues.particulars[+activeParticularIndex]
              .details,
          };
        }
      }, [
        activeParticularIndex,
        activeParticularStep,
        reimbursementFormValues.particulars,
      ]),
    });

  return (
    <>
      {activeParticularStep === "details" && (
        <ParticularDetails
          formReturn={useReimbursementParticularDetailsFormReturn}
        />
      )}

      {activeParticularStep === "method-selection" && (
        <SelectAttachmentMethod />
      )}

      {activeParticularStep === "capture" && (
        <Capture formReturn={useReimbursementParticularDetailsFormReturn} />
      )}

      {activeParticularStep === "upload" && (
        <UploadAttachment
          formReturn={useReimbursementParticularDetailsFormReturn}
        />
      )}
    </>
  );
};

export default ParticularForm;
