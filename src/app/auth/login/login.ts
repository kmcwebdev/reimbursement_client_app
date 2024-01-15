"use server";

import { signIn } from "~/app/auth";
import { type Credentials } from "~/schema/auth.schema";

export const handleCredentialsLogin = async (credentials: Credentials) => {
  "use server";

  await signIn("credentials", {
    ...credentials,
    redirectTo: "/dashboard",
  });
};

export const handleAzureAdLogin = async () => {
  "use server";
  await signIn(
    "azure-ad",
    {
      redirectTo: "/dashboard",
    },
    {
      prompt: "login",
    },
  );
};
