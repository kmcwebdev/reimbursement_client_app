import { RequiredAuthProvider, useRedirectFunctions } from "@propelauth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "~/app/store";
import PageAnimation from "~/components/animation/PageAnimation";
import Layout from "~/components/core/layout";
import { env } from "~/env.mjs";
import "~/styles/globals.css";

const RedirectToCustomLocation = () => {
  const { redirectToLoginPage } = useRedirectFunctions();

  redirectToLoginPage({
    postLoginRedirectUrl:
      env.NEXT_PUBLIC_ENVIRONMENT === "development"
        ? `${window.location.href}`
        : `https://${window.location.hostname}`,
  });

  return null;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RequiredAuthProvider
      authUrl={env.NEXT_PUBLIC_PROPELAUTH_URL}
      displayWhileLoading={<div>Auth Loading....</div>}
      displayIfLoggedOut={<RedirectToCustomLocation />}
    >
      <Provider store={store}>
        <Layout>
          <PageAnimation>

            <Component {...pageProps} />
          </PageAnimation>
        </Layout>
      </Provider>
    </RequiredAuthProvider>
  );
}
