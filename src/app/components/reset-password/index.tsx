"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "~/features/api/actions-api-slice";
import { changePasswordSchema } from "~/schema/change-password.schema";
import {
  type ChangePassword,
  type ChangePasswordPayload,
  type RtkApiError,
} from "~/types/reimbursement.types";
import EmptyState from "../core/EmptyState";
import { showToast } from "../core/Toast";
import ResetPasswordForm from "../shared/reset-password-form";

const ResetPassword: React.FC = () => {
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

            <ResetPasswordForm
              formReturn={formReturn}
              handleConfirmChangePassword={handleConfirmChangePassword}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
