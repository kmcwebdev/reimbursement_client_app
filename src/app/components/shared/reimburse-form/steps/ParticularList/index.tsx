import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";
import Particulars from "./List";
import ParticularDetailsForm from "./ParticularDetailsForm";

interface ParticularListProps {
  handleOpenCancelDialog: () => void;
  formReturn: UseFormReturn<ParticularDetails>;
}

const ParticularList: React.FC<ParticularListProps> = ({
  handleOpenCancelDialog,
  formReturn,
}) => {
  const { particularDetailsFormIsVisible } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  return (
    <>
      {!particularDetailsFormIsVisible && (
        <Particulars handleOpenCancelDialog={handleOpenCancelDialog} />
      )}

      {particularDetailsFormIsVisible && (
        <ParticularDetailsForm formReturn={formReturn} />
      )}
    </>
  );
};

export default ParticularList;
