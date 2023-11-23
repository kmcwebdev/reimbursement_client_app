"use client";
import { AuthProvider } from "@propelauth/nextjs/client";
import { type ReactNode } from "react";
import { env } from "~/env.mjs";

const PropelAuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider authUrl={env.NEXT_PUBLIC_AUTH_URL}>{children}</AuthProvider>
  );
};

export default PropelAuthProvider;
