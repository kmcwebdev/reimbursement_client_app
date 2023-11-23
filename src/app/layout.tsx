import { getUserOrRedirect } from "@propelauth/nextjs/server/app-router";
import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";
import "~/styles/globals.css";
import Layout from "./components/core/layout";
import { AbilityContextProvider } from "./components/providers/AbilityContextProvider";
import PropelAuthProvider from "./components/providers/PropelAuthProvider";
import ReduxStoreProvider from "./components/providers/ReduxStoreProvider";

const Toaster = dynamic(() => import("~/context/Toaster"));

export const RootLayout: NextPage<PropsWithChildren> = async ({ children }) => {
  const user = await getUserOrRedirect();

  if (!user) {
    redirect("/api/auth/login");
  }

  return (
    <html lang="en">
      <body>
        <PropelAuthProvider>
          <ReduxStoreProvider>
            <AbilityContextProvider>
              <Toaster />
              <Layout>{children}</Layout>
            </AbilityContextProvider>
          </ReduxStoreProvider>
        </PropelAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
