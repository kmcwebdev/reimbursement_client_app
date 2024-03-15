"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "~/features/api/actions-api-slice";
import { changePasswordSchema } from "~/schema/change-password.schema";
import {
  ChangePasswordPayload,
  type ChangePassword,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { Button } from "../core/Button";
import EmptyState from "../core/EmptyState";
import { showToast } from "../core/Toast";
import Form from "../core/form";
import Input from "../core/form/fields/Input";

const ResetPasswordForm: React.FC = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [changePasswordMutation, { isLoading: isSubmitting }] =
    useChangePasswordMutation();

  const formReturn = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const handleConfirmChangePassword = (payload: ChangePassword) => {
    if (token) {
      const body: ChangePasswordPayload = {
        new_password: payload.password,
        token: token,
      };

      void changePasswordMutation(body)
        .unwrap()
        .then(() => {
          showToast({
            type: "success",
            description: "Password has been changed successfully",
          });
          formReturn.reset();
          router.push("/auth/login");
        })
        .catch((error: RtkApiError) => {
          showToast({
            type: "error",
            description: error.data.detail,
          });
        });
    }
  };

  return (
    <div className="grid h-full w-full place-items-center rounded-md">
      {!token && (
        <EmptyState
          title="Invalid URL."
          description="Your password reset link is invalid."
        />
      )}
      {token && (
        <div className="flex w-2/12 gap-4">
          <div className="flex flex-1 flex-col gap-4 rounded-md bg-white p-4">
            <div className="flex flex-col items-center">
              <div className="relative h-12 w-12">
                <Image src="/images/logo.png" alt="kmclogo" fill />
              </div>
              <h4 className="text-orange-600">KMC REIMBURSEMENT</h4>

              <p className="font-medium">ACCOUNT RECOVERY</p>
            </div>

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
                  loading={isSubmitting}
                  disabled={!formReturn.formState.isValid || isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;
