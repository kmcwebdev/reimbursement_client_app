import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import Dialog from "~/components/core/Dialog";
import dynamic from "next/dynamic";
import {
  type ReimbursementDetailsDTO,
} from "~/types/reimbursement.types";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ReimbursementDetailsSchema } from "~/schema/reimbursement-details.schema";
import {
  clearReimbursementForm,
  toggleCancelDialog,
  toggleFormDialog,
} from "~/features/reimbursement-form-slice";

const ReimburseForm = dynamic(
  () => import("~/components/dashboard/employee/reimburse-form"),
);

export default function Home() {


  const { formDialogIsOpen, cancelDialogIsOpen, reimbursementDetails } =
    useAppSelector((state) => state.reimbursementForm);
  const dispatch = useAppDispatch();

  //Form return for Details
  const useReimbursementDetailsFormReturn = useForm<ReimbursementDetailsDTO>({
    resolver: zodResolver(ReimbursementDetailsSchema),
    defaultValues: useMemo(() => {
      if (reimbursementDetails) {
        return { ...reimbursementDetails };
      }
    }, [reimbursementDetails]),
    mode: "onChange",
  });

   /***Closes the form and open cancel dialog */
   const handleOpenCancelDialog = () => {
    dispatch(toggleFormDialog());
    dispatch(toggleCancelDialog());
  };

  /**Continue reimbursement request cancellation */
  const handleConfirmCancellation = () => {
    dispatch(clearReimbursementForm());
    useReimbursementDetailsFormReturn.reset();
    dispatch(toggleCancelDialog());
  };

  /**Aborts reimbursement request cancellation */
  const handleAbortCancellation = () => {
    dispatch(toggleCancelDialog());
    dispatch(toggleFormDialog());
  };

  return (
    <section className="grid h-full w-full place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1>Welcome!</h1>
        <p>File your reimbursements in one place!</p>
        <Button onClick={() => dispatch(toggleFormDialog())}>File a Reimbursement</Button>
      </div>

      <Dialog
          title="File a Reimbursement"
          isVisible={formDialogIsOpen}
          close={handleOpenCancelDialog}
        >
          <ReimburseForm
            formReturn={useReimbursementDetailsFormReturn}
            handleOpenCancelDialog={handleOpenCancelDialog}
          />
        </Dialog>

        <Dialog
          title="Cancel Reimbursements?"
          isVisible={cancelDialogIsOpen}
          close={handleAbortCancellation}
        >
          <div className="flex flex-col gap-8 pt-8">
            <p className="text-neutral-800">
              Are you sure you want to cancel reimbursement request?
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="neutral"
                buttonType='outlined'
                className="w-1/2"
                onClick={handleAbortCancellation}
              >
                No
              </Button>
              <Button
                variant="danger"
                className="w-1/2"
                onClick={handleConfirmCancellation}
              >
                Yes
              </Button>
            </div>
          </div>
        </Dialog>
    </section>
  );
}
