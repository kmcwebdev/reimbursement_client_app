import { type Metadata, type NextPage, type Viewport } from "next";
import dynamic from "next/dynamic";
import { type PropsWithChildren } from "react";
import "~/styles/globals.css";
import Layout from "./components/core/layout";
import { AbilityContextProvider } from "./components/providers/AbilityContextProvider";
import NextAuthSessionProvider from "./components/providers/NextAuthSessionProvider";
import ReduxStoreProvider from "./components/providers/ReduxStoreProvider";

const Toaster = dynamic(() => import("~/context/Toaster"));

export const metadata: Metadata = {
  applicationName: "KMC Reimbursements",
  description: "KMC Reimbursements",
  appleWebApp: true,
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: {
      url: "/favicon.ico",
      type: "image/x-icon",
    },
    shortcut: {
      url: "/favicon.ico",
      type: "image/x-icon",
    },
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  userScalable: false,
};

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
