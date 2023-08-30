import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { Button } from "~/components/core/Button";
import Upload from "~/components/core/Upload";
import { setActiveStep } from "~/features/reimbursement-form-slice";
import { type ReimbursementAttachmentsDTO } from "~/types/reimbursement.types";

interface UploadAttachmentsProps {
  formReturn: UseFormReturn<ReimbursementAttachmentsDTO>;
}

const UploadAttachments: React.FC<UploadAttachmentsProps> = () => {
  const { activeStep } = useAppSelector((state) => state.reimbursementForm);
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col gap-4">
      <Upload />

      <div className="my-4 flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary-inactive"></div>
        <div className="h-2 w-2 rounded-full bg-primary-default"></div>
      </div>

      <div className="grid grid-cols-2 items-center gap-4">
        <Button
          type="button"
          buttonType="outlined"
          variant="neutral"
          className="w-full"
          onClick={() => dispatch(setActiveStep(activeStep - 1))}
        >
          Previous
        </Button>
        <Button type="submit" className="w-full">
          Reimburse
        </Button>
      </div>
    </div>
  );
};

export default UploadAttachments;
