import { AuthProvider } from "@propelauth/nextjs/client";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "~/app/store";
import Layout from "~/components/core/layout";
import { env } from "~/env.mjs";
import "~/styles/globals.css";
import { UserAccessProvider } from "~/context/AccessContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider authUrl={env.NEXT_PUBLIC_AUTH_URL}>
      <Provider store={store}>
        <UserAccessProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserAccessProvider>
      </Provider>
    </AuthProvider>
  );
}
