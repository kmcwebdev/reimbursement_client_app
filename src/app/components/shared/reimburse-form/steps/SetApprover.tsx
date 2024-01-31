import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { MdMail } from "react-icons-all-files/md/MdMail";
import { Button } from "~/app/components/core/Button";
import { showToast } from "~/app/components/core/Toast";
import Form from "~/app/components/core/form";
import Input from "~/app/components/core/form/fields/Input";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useCreateReimbursementMutation } from "~/features/api/reimbursement-form-api-slice";
import {
  clearReimbursementForm,
  setActiveStep,
  setSelectedAttachmentMethod,
  toggleFormDialog,
} from "~/features/state/reimbursement-form-slice";
import {
  ApproverSchema,
  type Approver,
} from "~/schema/reimbursement-approver.schema";
import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";
import { type MutationError } from "~/types/global-types";

interface SetApproverProps {
  formReturn: UseFormReturn<ParticularDetails>;
  handleResetRequestType: () => void;
}

const SetApprover: React.FC<SetApproverProps> = ({
  formReturn,
  handleResetRequestType,
}) => {
  const { activeStep, reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  const dispatch = useAppDispatch();

  const useSetApproverFormReturn = useForm<Approver>({
    resolver: zodResolver(ApproverSchema),
    mode: "onChange",
    defaultValues: useMemo(() => {
      if (reimbursementFormValues.manager_approver_email) {
        return {
          manager_approver_email:
            reimbursementFormValues.manager_approver_email,
        };
      }
    }, [reimbursementFormValues]),
  });

  const [createReimbursement, { isLoading: isSubmitting }] =
    useCreateReimbursementMutation();

  const handleSubmit = (e: Approver) => {
    const payload = {
      ...reimbursementFormValues,
      manager_approver_email: e.manager_approver_email,
    };

    void createReimbursement(payload)
      .unwrap()
      .then(() => {
        dispatch(toggleFormDialog());
        dispatch(clearReimbursementForm());
        dispatch(setSelectedAttachmentMethod(null));
        handleResetRequestType();
        formReturn.reset();
        showToast({
          type: "success",
          description:
            "Your reimbursement request has been submitted successfully!",
        });
      })
      .catch((error: MutationError) => {
        if (Array.isArray(error.data.errors)) {
          showToast({
            type: "error",
            description: error.data.errors[0].message,
          });
        } else {
          showToast({
            type: "error",
            description: error.data.message,
          });
        }
      });
  };

  return (
    <Form
      name="particular-form"
      useFormReturn={useSetApproverFormReturn}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 pt-4"
    >
      <div className="relative">
        <Input
          label="Approver"
          icon={MdMail as IconType}
          name="manager_approver_email"
          placeholder="Add an Approver"
        />
      </div>

      <div className="grid grid-cols-2 items-center gap-2 pt-4">
        <div>
          <Button
            aria-label="Return"
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={() => {
              dispatch(setActiveStep(activeStep - 1));
            }}
          >
            Return
          </Button>
        </div>

        <Button
          aria-label="Submit"
          type="submit"
          className="w-full"
          loading={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default SetApprover;
