// import { RequiredAuthProvider, useRedirectFunctions } from "@propelauth/react";
import type { AppProps } from "next/app";
import Layout from "~/components/core/layout";
import { UserAccessProvider } from "~/context/AccessContext";
import "~/styles/globals.css";
// import { env } from "~/env.mjs";

// const RedirectToCustomLocation = () => {
//   const { redirectToLoginPage } = useRedirectFunctions();

//   redirectToLoginPage({
//     postLoginRedirectUrl:
//       env.NEXT_PUBLIC_ENVIRONMENT === "development"
//         ? `${window.location.href}`
//         : `https://${window.location.hostname}`,
//   });

//   return null;
// };

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <RequiredAuthProvider
    //   authUrl={env.NEXT_PUBLIC_PROPELAUTH_URL}
    //   displayWhileLoading={<div>Auth Loading....</div>}
    //   displayIfLoggedOut={<RedirectToCustomLocation />}
    // >

    <UserAccessProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserAccessProvider>

    // </RequiredAuthProvider>
  );
}
