import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UserApiService from "~/app/api/services/user-service";
import { useAppSelector } from "~/app/hook";
import { changePasswordSchema } from "~/schema/change-password.schema";
import { initialLoginFormSchema } from "~/schema/initial-login.schema";
import {
  type ChangePassword,
  type ChangePasswordPayload,
  type InitialLoginFormPayload,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { Button } from "../../core/Button";
import { showToast } from "../../core/Toast";
import Form from "../../core/form";
import Input from "../../core/form/fields/Input";

const InitialLoginForm: React.FC = () => {
  const { user, accessToken } = useAppSelector((state) => state.session);
  const [submittedPassword, setSubmittedPassword] = useState<string>();
  const router = useRouter();

  const changePassFormReturn = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const updateBasicInfoFormReturn = useForm<InitialLoginFormPayload>({
    resolver: zodResolver(initialLoginFormSchema),
    mode: "onChange",
  });

  const {
    mutateAsync: changePasswordMutation,
    isLoading: isChangePasswordSubmitting,
  } = UserApiService.useUpdateProfilePassword({
    onSuccess: async () => {
      await signOut();
      localStorage.removeItem("_user_session");
      showToast({
        type: "success",
        description: "Password has been changed successfully",
      });
      updateBasicInfoFormReturn.reset();
      changePassFormReturn.reset();
      router.push("/auth/login");
    },
    onError: (error) => {
      showToast({
        type: "error",
        description: error.data.detail,
      });
    },
  });

  const {
    mutateAsync: updateBasicInfoMutation,
    isLoading: isUpdateBasicInfoSubmitting,
  } = UserApiService.useUpdateBasicInfo({
    onSuccess: () => {
      if (submittedPassword) {
        handleChangePassword(submittedPassword);
      }
    },
    onError: (error: RtkApiError) => {
      showToast({
        type: "error",
        description: error.data.detail,
      });
    },
  });

  const handleChangePassword = (e: string) => {
    const body: Pick<ChangePasswordPayload, "new_password"> = {
      new_password: e,
    };

    void changePasswordMutation(body);
  };

  const handleInitialLoginForm = (e: Partial<InitialLoginFormPayload>) => {
    if (accessToken) {
      if (user && !user.last_name) {
        if (e.first_name && e.last_name) {
          const updateMe = {
            first_name: e.first_name,
            last_name: e.last_name,
          };
          setSubmittedPassword(e.password);
          void updateBasicInfoMutation(updateMe);
        }
      } else {
        if (e.password) {
          handleChangePassword(e.password);
        }
      }
    }
  };

  console.log(changePassFormReturn.formState.errors);

  return (
    <>
      {user && !user.last_name && (
        <Form
          useFormReturn={updateBasicInfoFormReturn}
          name="change-password"
          onSubmit={handleInitialLoginForm}
          className="flex flex-col gap-4"
        >
          <Input
            label="First Name"
            name="first_name"
            placeholder="First Name"
          />

          <Input label="Last Name" name="last_name" placeholder="Last Name" />

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
              loading={
                isChangePasswordSubmitting || isUpdateBasicInfoSubmitting
              }
              disabled={
                !updateBasicInfoFormReturn.formState.isValid ||
                isChangePasswordSubmitting ||
                isUpdateBasicInfoSubmitting
              }
            >
              Submit
            </Button>
          </div>
        </Form>
      )}

      {user && user.last_name && (
        <Form
          useFormReturn={changePassFormReturn}
          name="change-password"
          onSubmit={handleInitialLoginForm}
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
              loading={
                isChangePasswordSubmitting || isUpdateBasicInfoSubmitting
              }
              disabled={
                !changePassFormReturn.formState.isValid ||
                isChangePasswordSubmitting
              }
            >
              Submit
            </Button>
          </div>
        </Form>
      )}
    </>
  );
};

export default InitialLoginForm;
