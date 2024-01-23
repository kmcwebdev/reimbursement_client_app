"use client";

import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import { Button } from "~/app/components/core/Button";

// interface SSRProps {
//   userJson: string;
// }

const Home: NextPage = () => {
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem("alreadyLoggedIn", "true");
    router.push("/dashboard");
  };

  return (
    <section className="grid h-full w-full place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1>Welcome!</h1>
        <p>File your reimbursements in one place!</p>
        <Button onClick={handleClick}>File a Reimbursement</Button>
      </div>
    </section>
  );
};

export default Home;
