import { useRouter } from "next/router";
import React, { useState, type PropsWithChildren } from "react";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { useAppSelector } from "~/app/hook";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import { classNames } from "~/utils/classNames";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const [collapsed, setIsCollapsed] = useState<boolean>(false);

  const { user } = useAppSelector((state) => state.session);
  const router = useRouter();

  const toggleSidebarWidth = () => {
    setIsCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} toggleSidebarWidth={toggleSidebarWidth} />

      <main
        className={classNames(
          collapsed
            ? "md:max-w-[calc(100vw_-_24px)]"
            : "md:max-w-[calc(100vw_-_101px)]",
          `${karla.variable} ${barlow_Condensed.variable} w-full flex-1 overflow-y-auto bg-white font-karla`,
        )}
      >
        <Header />
        <div className="relative flex h-[calc(100vh_-_4rem)] w-full flex-col">
          <div
            className={classNames(
              "relative h-full w-full overflow-hidden overflow-y-auto bg-white p-4",
            )}
          >
            {children}
          </div>
          <div className="absolute h-16" />

          <div className="flex h-16 items-center justify-evenly border-t bg-black px-8 md:hidden">
            <div
              className="flex flex-col items-center justify-center gap-1"
              onClick={() => void router.push("/dashboard")}
            >
              <MdDashboard
                className={classNames(
                  router.pathname.includes("dashboard")
                    ? "h-5 w-5 text-orange-600"
                    : "h-3 w-3 text-neutral-600",
                  "transition-all ease-in-out",
                )}
              />
              <p className="text-[10px] text-white">Dashboard</p>
            </div>

            {user &&
              user.assignedRole ===
                "External Reimbursement Approver Manager" && (
                <div
                  className="flex flex-col items-center justify-center gap-1"
                  onClick={() => void router.push("/approval")}
                >
                  <MdGavel
                    className={classNames(
                      router.pathname.includes("approval")
                        ? "h-5 w-5 text-orange-600"
                        : "h-3 w-3 text-neutral-600",
                      "transition-all ease-in-out",
                    )}
                  />
                  <p className="text-[10px] text-white">Approval</p>
                </div>
              )}
            {user && user.assignedRole === "HRBP" && (
              <div
                className="flex flex-col items-center justify-center gap-1"
                onClick={() => void router.push("/reimbursements")}
              >
                <MdReceipt
                  className={classNames(
                    router.pathname.includes("reimbursements")
                      ? "h-5 w-5 text-orange-600"
                      : "h-3 w-3 text-neutral-600",
                    "transition-all ease-in-out",
                  )}
                />
                <p className="text-[10px] text-white">Reimbursement</p>
              </div>
            )}

            <div
              className="flex flex-col items-center justify-center gap-1"
              onClick={() => void router.push("/profile")}
            >
              <MdPerson
                className={classNames(
                  router.pathname.includes("profile")
                    ? "h-5 w-5 text-orange-600"
                    : "h-3 w-3 text-neutral-600",
                  "transition-all ease-in-out",
                )}
              />
              <p className="text-[10px] text-white">Profile</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
