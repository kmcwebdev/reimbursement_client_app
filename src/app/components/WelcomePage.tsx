"use client";

import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hook";
import AuthLoader from "./loaders/AuthLoader";
import InitialLoginForm from "./shared/initial-login";

const WelcomePage: NextPage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.session);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      if (user.profile) {
        if (!user.profile.first_login) {
          router.push("/dashboard");
        }
      } else {
        router.push("/no-assigned-group");
      }
    }

    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading) {
    return <AuthLoader message="Validating your account, please wait..." />;
  }

  return (
    <>
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
