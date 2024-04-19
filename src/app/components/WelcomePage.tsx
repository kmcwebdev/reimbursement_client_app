"use client";

import { type NextPage } from "next";
import { redirect } from "next/navigation";
import { useAppSelector } from "../hook";
import AuthLoader from "./loaders/AuthLoader";
import InitialLoginForm from "./shared/initial-login";

const WelcomePage: NextPage = () => {
  const { user } = useAppSelector((state) => state.session);

  if (user && user.profile && !user.profile.first_login) {
    redirect("/dashboard");
  }

  return (
    <>
      {!user?.profile?.first_login && <AuthLoader />}

      {user?.profile?.first_login && (
        <section className="grid h-screen w-screen place-items-center">
          <div className="flex w-3/12 flex-col items-center gap-4 rounded-md bg-white p-4 shadow-md">
            <h3 className="text-center">Welcome to Reimbursements!</h3>

            <h4>Let&apos;s finish setting up your account!</h4>

            <div className="w-full">
              <InitialLoginForm />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default WelcomePage;
