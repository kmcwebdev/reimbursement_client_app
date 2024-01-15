import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { type PropsWithChildren } from "react";
import "~/styles/globals.css";
import Layout from "./components/core/layout";
import { AbilityContextProvider } from "./components/providers/AbilityContextProvider";
import NextAuthSessionProvider from "./components/providers/NextAuthSessionProvider";
import ReduxStoreProvider from "./components/providers/ReduxStoreProvider";

const Toaster = dynamic(() => import("~/context/Toaster"));

export const RootLayout: NextPage<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ReduxStoreProvider>
          <NextAuthSessionProvider>
            <AbilityContextProvider>
              <Toaster />
              <Layout>{children}</Layout>
            </AbilityContextProvider>
          </NextAuthSessionProvider>
        </ReduxStoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
