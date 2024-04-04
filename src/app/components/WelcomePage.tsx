"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useChangeProfilePasswordMutation } from "~/features/api/actions-api-slice";
import { changePasswordSchema } from "~/schema/change-password.schema";
import {
  type ChangePassword,
  type ChangePasswordPayload,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { useAppSelector } from "../hook";
import { showToast } from "./core/Toast";
import AuthLoader from "./loaders/AuthLoader";
import ResetPasswordForm from "./shared/reset-password-form";

const WelcomePage: NextPage = () => {
  const { user, accessToken } = useAppSelector((state) => state.session);
  const router = useRouter();

  if (user && user.profile && !user.profile.first_login) {
    redirect("/dashboard");
  }

  const [changeProfilePasswordMutation, { isLoading: isSubmitting }] =
    useChangeProfilePasswordMutation();

  const formReturn = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const handleConfirmChangePassword = (payload: ChangePassword) => {
    if (accessToken) {
      const body: Pick<ChangePasswordPayload, "new_password"> = {
        new_password: payload.password,
      };

      void changeProfilePasswordMutation(body)
        .unwrap()
        .then(async () => {
          await signOut();
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
    <>
      {!user?.profile?.first_login && <AuthLoader />}

      {user?.profile?.first_login && (
        <section className="grid h-screen w-screen place-items-center">
          <div className="flex flex-col items-center gap-4 bg-white shadow-md rounded-md p-4 w-3/12">
            <h3 className="text-center">Welcome to Reimbursements!</h3>

            <h4>Let&apos;s finish setting up your account!</h4>

            <div className="w-full">
              <ResetPasswordForm
              formReturn={formReturn}
              handleConfirmChangePassword={handleConfirmChangePassword}
              isLoading={isSubmitting}
            />
            </div>
            
          </div>
        </section>
      )}
    </>
  );
};

export default WelcomePage;
