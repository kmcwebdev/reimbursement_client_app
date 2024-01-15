"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SiMicrosoftoffice } from "react-icons-all-files/si/SiMicrosoftoffice";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import Form from "~/app/components/core/form";
import Input from "~/app/components/core/form/fields/Input";
import { CredentialsSchema, type Credentials } from "~/schema/auth.schema";
import { handleAzureAdLogin, handleCredentialsLogin } from "./login";

interface pageProps {}

const Login: React.FC<pageProps> = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginIsError] = useState<boolean>(false);
  const useCredentialsForm = useForm<Credential>({
    resolver: zodResolver(CredentialsSchema),
    mode: "onChange",
  });

  const handleOnChange = () => {
    if (loginError) {
      setLoginIsError(false);
    }
  };

  const onSubmit = async (e: Credentials) => {
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

  return (
    <div className="flex w-80 flex-col gap-4 rounded-md bg-white p-4 shadow-md">
      <div className="flex flex-col items-center">
        <div className="relative h-12 w-12">
          <Image src="/images/logo.png" alt="kmclogo" fill />
        </div>
        <h4 className="text-orange-600">KMC REIMBURSEMENT</h4>

        <p className="font-medium">LOGIN</p>
      </div>

      <CollapseHeightAnimation isVisible={loginError}>
        <p className="font-medium text-red-600">
          Login Failed! Please check your credentials!
        </p>
      </CollapseHeightAnimation>

      <Form
        name="login-form"
        useFormReturn={useCredentialsForm}
        onSubmit={(e: Credentials) => void onSubmit(e)}
        className="flex w-full flex-col gap-4"
      >
        <Input
          label="Username or Email"
          name="username"
          placeholder="Username"
          onChange={handleOnChange}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleOnChange}
        />

        <Button type="submit" className="w-full" loading={loading}>
          Login
        </Button>
      </Form>

      <div className="flex flex-col items-center gap-4">
        <p className="text-neutral-600">Or sign in with</p>

        <Button
          onClick={() => void handleAzureAdLogin()}
          className="w-full"
          buttonType="outlined"
          variant="informative"
        >
          <SiMicrosoftoffice className="h-5 w-5" />
          MS Office 365
        </Button>
      </div>
    </div>
  );
};

export default Login;
