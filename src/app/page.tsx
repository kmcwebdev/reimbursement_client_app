"use client";

import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "~/app/components/core/Button";

// interface SSRProps {
//   userJson: string;
// }

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const nextAuthSession = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isInitialLogin = localStorage.getItem("alreadyLoggedIn");

      if (nextAuthSession.status === "authenticated") {
        if (isInitialLogin && JSON.parse(isInitialLogin)) {
          window.location.replace("/dashboard");
        } else {
          setLoading(false);
        }
      } else {
        window.location.replace("/auth/login");
      }
    }
  }, [nextAuthSession.status]);

  const handleClick = () => {
    localStorage.setItem("alreadyLoggedIn", "true");
    if (typeof window !== "undefined") {
      void window.location.replace("/dashboard");
    }
  };

  return (
    <section className="grid h-full w-full place-items-center">
      {!loading && (
        <div className="flex flex-col items-center gap-4">
          <h1>Welcome!</h1>
          <p>File your reimbursements in one place!</p>
          <Button onClick={handleClick}>File a Reimbursement</Button>
        </div>
      )}
    </section>
  );
};

export default Home;
