import React, { type PropsWithChildren } from "react";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import Header from "./Header";
import Sidebar from "./Sidebar";

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

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (

    // <RequiredAuthProvider
    //   authUrl={env.NEXT_PUBLIC_PROPELAUTH_URL}
    //   displayWhileLoading={<div>Auth Loading....</div>}
    //   displayIfLoggedOut={<RedirectToCustomLocation />}
    // >
    //   <Provider store={store}>
    <div className="flex min-h-screen">
      <Sidebar />

      <main
        className={`${karla.variable} ${barlow_Condensed.variable} flex-1 overflow-y-auto bg-white font-karla`}
      >
        <Header />
        <div className="relative flex h-[calc(100vh_-_4rem)]">




          <div className='h-full w-full overflow-y-auto bg-white p-4'>
            {children}
          </div>

          {/* <div className="h-16" /> !DO NOT REMOVE (Space for components that has footer) */}
          <div className="h-16" />
        </div>
      </main>
    </div>
    //   </Provider>
    // </RequiredAuthProvider>
  );
};

export default Layout;
