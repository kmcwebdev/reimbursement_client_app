import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { type ChangePassword } from "~/types/reimbursement.types";
import { Button } from "../../core/Button";
import Form from "../../core/form";
import Input from "../../core/form/fields/Input";

interface ResetPasswordFormProps {
  isLoading: boolean;
  formReturn: UseFormReturn<ChangePassword>;
  handleConfirmChangePassword: (e: ChangePassword) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  formReturn,
  handleConfirmChangePassword,
  isLoading,
}) => {
  return (
    <Form
      useFormReturn={formReturn}
      name="change-password"
      onSubmit={handleConfirmChangePassword}
      className="flex flex-col gap-4"
    >
      <Input
        label="New Password"
        type="password"
        name="password"
        placeholder="New Password"
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="New Password"
      />

      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          loading={isLoading}
          disabled={!formReturn.formState.isValid || isLoading}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default ResetPasswordForm;
