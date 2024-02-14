import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { useHoldReimbursementMutation } from "~/features/api/actions-api-slice";
import { toggleHoldDialog } from "~/features/state/table-state.slice";
import {
  OnholdReimbursementSchema,
  type OnholdReimbursementType,
} from "~/schema/reimbursement-onhold-form.schema";
import { Button } from "../../core/Button";
import Dialog from "../../core/Dialog";
import { showToast } from "../../core/Toast";
import Form from "../../core/form";
import TextArea from "../../core/form/fields/TextArea";

const HoldReimbursementDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { holdDialogIsOpen, focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );
  const [holdReimbursement, { isLoading: isOnHolding }] =
    useHoldReimbursementMutation();

  const formReturn = useForm<OnholdReimbursementType>({
    resolver: zodResolver(OnholdReimbursementSchema),
    mode: "onChange",
  });
  const onAbort = () => {
    formReturn.reset();
    dispatch(toggleHoldDialog());
  };

  const handleConfirmHold = (values: OnholdReimbursementType) => {
    if (focusedReimbursementId) {
      const payload = {
        id: focusedReimbursementId,
        remarks: values.remarks,
      };

      void holdReimbursement(payload)
        .unwrap()
        .then(() => {
          dispatch(
            appApiSlice.util.invalidateTags([{ type: "ReimbursementRequest" }]),
          );
          showToast({
            type: "success",
            description: "Reimbursement Request successfully put onhold!",
          });
          onAbort();
        })
        .catch(() => {
          showToast({
            type: "error",
            description: "Rejection failed!",
          });
        });
    }
  };

  return (
    <Dialog
      title="Hold Reimbursement?"
      isVisible={holdDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <Form
        name="holdReimbursementForm"
        useFormReturn={formReturn}
        onSubmit={handleConfirmHold}
      >
        <div className="flex flex-col gap-8 pt-8">
          <TextArea
            name="remarks"
            label="Reasons for putting on hold"
            required
          />

          <div className="flex items-center gap-4">
            <Button
              aria-label="Cancel"
              type="button"
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={onAbort}
              disabled={isOnHolding}
            >
              Cancel
            </Button>
            <Button
              aria-label="Hold"
              className="w-1/2"
              variant="warning"
              type="submit"
              disabled={isOnHolding}
              loading={isOnHolding}
            >
              Hold
            </Button>
          </div>
        </div>
      </Form>
    </Dialog>
  );
};

export default HoldReimbursementDialog;
