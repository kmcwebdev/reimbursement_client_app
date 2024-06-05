"use client";

import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "../hook";
import InitialLoginForm from "./shared/initial-login";

const WelcomePage: NextPage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (user) {
      if (user.profile) {
        if (!user.profile.first_login) {
          router.push("/dashboard");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
