"use server";

import { signIn } from "~/app/auth";
import { type Credentials } from "~/types/reimbursement.types";

export const handleCredentialsLogin = async (credentials: Credentials) => {
  await signIn("credentials", {
    ...credentials,
    redirectTo: "/",
  });
};

export const handleAzureAdLogin = async () => {
  await signIn(
    "azure-ad",
    {
      redirectTo: "/",
    },
    {
      prompt: "login",
    },
  );
};
