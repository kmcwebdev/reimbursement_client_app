import {
  AuthProvider,
  type WithAuthInfoProps,
  useRedirectFunctions,
  withAuthInfo,
  type WithAuthInfoArgs,
} from "@propelauth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "~/app/store";
import PageAnimation from "~/components/animation/PageAnimation";
import Layout from "~/components/core/layout";
import { env } from "~/env.mjs";
import { type PropsWithChildren } from "react";
import "~/styles/globals.css";


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
    displayWhileLoading: <div>Auth Loading....</div>,
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
