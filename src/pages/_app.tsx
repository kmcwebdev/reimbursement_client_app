import { AuthProvider } from "@propelauth/nextjs/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import store from "~/app/store";
import Layout from "~/components/core/layout";
import { UserAccessProvider } from "~/context/AccessContext";
import { env } from "~/env.mjs";
import "~/styles/globals.css";

const Toaster = dynamic(() => import("~/context/Toaster"));

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider authUrl={env.NEXT_PUBLIC_AUTH_URL}>
      <Provider store={store}>
        <UserAccessProvider>
          <Toaster />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserAccessProvider>
      </Provider>
    </AuthProvider>
  );
}
