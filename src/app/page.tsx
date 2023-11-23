"use client";

import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "~/app/components/core/Button";

// interface SSRProps {
//   userJson: string;
// }

const Home: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useMemo(() => {
    const isInitialLogin = localStorage.getItem("alreadyLoggedIn");
    if (isInitialLogin && JSON.parse(isInitialLogin)) {
      void router.push("/dashboard");
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    localStorage.setItem("alreadyLoggedIn", "true");
    void router.push("/dashboard");
  };

  return (
    <>
      {!loading && (
        <section className="grid h-full w-full place-items-center">
          <div className="flex flex-col items-center gap-4">
            <h1>Welcome!</h1>
            <p>File your reimbursements in one place!</p>
            <Button onClick={handleClick}>File a Reimbursement</Button>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const user = await getUserFromServerSideProps(context);

//   if (!user) {
//     return {
//       redirect: {
//         destination: "/api/auth/login",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       userJson: JSON.stringify(user),
//     },
//   };
// };
