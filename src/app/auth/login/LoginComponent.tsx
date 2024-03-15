"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SiMicrosoftoffice } from "react-icons-all-files/si/SiMicrosoftoffice";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import { showToast } from "~/app/components/core/Toast";
import Form from "~/app/components/core/form";
import Input from "~/app/components/core/form/fields/Input";
import { useForgotPasswordMutation } from "~/features/api/actions-api-slice";
import { credentialsSchema } from "~/schema/auth.schema";
import { forgotPasswordSchema } from "~/schema/forgot-password.schema";
import {
  type Credentials,
  type ForgotPasswordPayload,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { handleAzureAdLogin, handleCredentialsLogin } from "./login";

const LoginComponent: React.FC = () => {
  const [showLoginForm, setShowLoginForm] = useState<boolean>(true);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginIsError] = useState<boolean>(false);

  const [forgotPasswordMutation, { isLoading: isSubmitting }] =
    useForgotPasswordMutation();

  const useCredentialsForm = useForm<Credential>({
    resolver: zodResolver(credentialsSchema),
    mode: "onChange",
  });

  const useForgotPasswordForm = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onLogin = async (e: Credentials) => {
    setLoginIsError(false);
    setIsLoading(true);
    try {
      await handleCredentialsLogin(e);
      setIsLoading(false);
    } catch (error) {
      setLoginIsError(true);
      setIsLoading(false);
    }
  };

  const onForgotPassword = (payload: ForgotPasswordPayload) => {
    forgotPasswordMutation(payload)
      .unwrap()
      .then(() => {
        showToast({
          type: "success",
          description:
            "A password reset link has been sent to your email address.",
        });

        setShowLoginForm(true);
      })
      .catch((error: RtkApiError) => {
        showToast({
          type: "error",
          description: error.data.detail,
        });
      });
  };

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex w-80 flex-col gap-4 rounded-md bg-white p-4 shadow-md">
        <div className="flex flex-col items-center">
          <div className="relative h-12 w-12">
            <Image src="/images/logo.png" alt="kmclogo" fill />
          </div>
          <h4 className="text-orange-600">KMC REIMBURSEMENT</h4>

          <p className="font-medium">
            {showLoginForm ? "LOGIN" : "FORGOT PASSWORD"}
          </p>

          {!showLoginForm && (
            <p className="pt-4 text-xs text-neutral-700">
              Enter your account&apos;s email address and a password reset link
              will be sent to you via email.
            </p>
          )}
        </div>

        <CollapseHeightAnimation isVisible={loginError}>
          <p className="font-medium text-red-600">
            Login Failed! Please check your credentials!
          </p>
        </CollapseHeightAnimation>

        {!showLoginForm && (
          <div className="flex flex-col gap-4">
            <Form
              name="login-form"
              useFormReturn={useForgotPasswordForm}
              onSubmit={(e: ForgotPasswordPayload) => void onForgotPassword(e)}
              className="flex w-full flex-col gap-4"
            >
              <Input label="Email" name="email" placeholder="Email" />

              <Button
                aria-label="Login"
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </Form>

            <div className="flex justify-end gap-4">
              <Button buttonType="text" onClick={() => setShowLoginForm(true)}>
                Sign in?
              </Button>
            </div>
          </div>
        )}

        {showLoginForm && (
          <div className="flex flex-col gap-4">
            <Form
              name="login-form"
              useFormReturn={useCredentialsForm}
              onSubmit={(e: Credentials) => void onLogin(e)}
              className="flex w-full flex-col gap-4"
            >
              <Input label="Username" name="username" placeholder="Username" />
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Password"
              />

              <Button
                aria-label="Login"
                type="submit"
                className="w-full"
                loading={loading}
              >
                Login
              </Button>
            </Form>

            <div className="flex flex-col items-center gap-4">
              <p className="text-neutral-600">Or sign in with</p>

              <Button
                aria-label="Ms Office 365"
                onClick={() => void handleAzureAdLogin()}
                className="w-full"
                buttonType="outlined"
                variant="informative"
                disabled={true}
              >
                <SiMicrosoftoffice className="h-5 w-5" />
                MS Office 365
              </Button>
            </div>

            <div className="flex justify-end gap-4">
              <Button buttonType="text" onClick={() => setShowLoginForm(false)}>
                Forgot Password?
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;
