import {
  AuthProvider,
  useRedirectFunctions,
  withAuthInfo,
  type WithAuthInfoArgs,
  type WithAuthInfoProps,
} from "@propelauth/react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import store from "~/app/store";
import Layout from "~/components/core/layout";
import { UserAccessProvider } from "~/context/AccessContext";
import { env } from "~/env.mjs";
import "~/styles/globals.css";

const AuthLoader = dynamic(() => import("~/components/loaders/AuthLoader"));

const RedirectToCustomLocation = withAuthInfo<
  WithAuthInfoProps & WithAuthInfoArgs & PropsWithChildren
>(
  (props) => {
    const { redirectToLoginPage } = useRedirectFunctions();

    if (!props.isLoggedIn) {
      redirectToLoginPage({
        postLoginRedirectUrl:
          env.NEXT_PUBLIC_ENVIRONMENT === "development"
            ? `${window.location.href}`
            : `https://${window.location.hostname}`,
      });

      return null;
    }

    return <>{props.children}</>;
  },
  {
    displayWhileLoading: <AuthLoader />,
  },
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider authUrl={env.NEXT_PUBLIC_PROPELAUTH_URL}>
      <RedirectToCustomLocation>
        <Provider store={store}>
          <UserAccessProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UserAccessProvider>
        </Provider>
      </RedirectToCustomLocation>
    </AuthProvider>
  );
}
