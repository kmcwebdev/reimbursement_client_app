"use client";

import { type NextPage } from "next";
import { redirect } from "next/navigation";
import AuthLoader from "./loaders/AuthLoader";

const WelcomePage: NextPage = () => {
  // const router = useRouter();

  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // const handleClick = () => {
  //   localStorage.setItem("alreadyLoggedIn", "true");
  //   router.push("/dashboard");
  // };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const isInitialLogin = localStorage.getItem("alreadyLoggedIn");

  //     if (isInitialLogin) {
  //       setIsLoggedIn(true);
  //     }
  //   }
  // }, [router]);

  // if (isLoggedIn) {
  redirect("/dashboard");
  // }

  return (
    <AuthLoader />
    // <section className="grid h-full w-full place-items-center">
    //   <div className="flex flex-col items-center gap-4">
    //     <h1>Welcome!</h1>
    //     <p>File your reimbursements in one place!</p>
    //     <Button aria-label="File a Reimbursement" onClick={handleClick}>
    //       File a Reimbursement
    //     </Button>
    //   </div>
    // </section>
  );
};

export default WelcomePage;
