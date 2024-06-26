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
  _setTempAttachedFiles,
  clearReimbursementForm,
  setActiveStep,
  toggleFormDialog,
} from "~/features/state/reimbursement-form-slice";
import { getApproverSchema } from "~/schema/reimbursement-approver.schema";
import {
  type Approver,
  type ParticularDetails,
  type RtkApiError,
} from "~/types/reimbursement.types";
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

  const { user } = useAppSelector((state) => state.session);

  const dispatch = useAppDispatch();

  const useSetApproverFormReturn = useForm<Approver>({
    resolver: useMemo(() => {
      if (user) {
        return zodResolver(getApproverSchema(true, user.email));
      }
      return undefined;
    }, [user]),
    mode: "onChange",
    defaultValues: useMemo(() => {
      if (reimbursementFormValues.manager_approver_email) {
        return {
          manager_approver_email:
            reimbursementFormValues.manager_approver_email,
        };
      } else {
        if (user?.profile?.managers && user.profile.managers.length > 0) {
          return {
            manager_approver_email: user?.profile?.managers[0].email,
          };
        }
      }
    }, [
      reimbursementFormValues.manager_approver_email,
      user?.profile?.managers,
    ]),
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
        dispatch(_setTempAttachedFiles([]));
        handleResetRequestType();
        formReturn.reset();
        showToast({
          type: "success",
          description:
            "Your reimbursement request has been submitted successfully!",
        });
      })
      .catch((error: RtkApiError) => {
        showToast({
          type: "error",
          description: error.data.detail,
        });
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
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default SetApprover;
