import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata, type NextPage, type Viewport } from "next";
import dynamic from "next/dynamic";
import { type PropsWithChildren } from "react";
import "~/styles/globals.css";
import { auth } from "./auth";
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
    icon: [
      {
        url: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "/favicon-32x132.png",
        type: "image/png",
        sizes: "132x32",
      },
    ],
    shortcut: {
      url: "/favicon.ico",
      type: "image/x-icon",
    },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  userScalable: false,
};

const RootLayout: NextPage<PropsWithChildren> = async ({ children }) => {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <ReduxStoreProvider>
          <NextAuthSessionProvider session={session}>
            <AbilityContextProvider>
              <Toaster />
              <Layout>
                {children}
                <SpeedInsights />
              </Layout>
            </AbilityContextProvider>
          </NextAuthSessionProvider>
        </ReduxStoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
