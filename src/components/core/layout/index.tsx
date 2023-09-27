import { useRouter } from "next/router";
import React, { useEffect, type PropsWithChildren } from "react";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { resetPageTableState } from "~/features/page-state.slice";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import { classNames } from "~/utils/classNames";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { sideBarCollapsed } = useAppSelector((state) => state.layoutState);

  const { user } = useAppSelector((state) => state.session);
  const router = useRouter();
  const dispatch = useAppDispatch();

  /**
   * This resets the page table filter to its initial state on every
   * router pathname change
   */
  useEffect(() => {
    dispatch(resetPageTableState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  if (router.pathname === "/") {
    return (
      <main
        className={classNames(
          `${karla.variable} ${barlow_Condensed.variable} h-screen w-screen flex-1 overflow-y-auto bg-white font-karla`,
        )}
      >
        <div className="grid h-full place-items-center">{children}</div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main
        className={classNames(
          sideBarCollapsed
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
            {user &&
              (user.assignedRole === "Finance" ||
                user.assignedRole === "HRBP" ||
                user.assignedRole ===
                  "External Reimbursement Approver Manager") && (
                <div
                  className="flex flex-col items-center justify-center gap-1"
                  onClick={() => void router.push("/history")}
                >
                  <MdReceipt
                    className={classNames(
                      router.pathname.includes("history")
                        ? "h-5 w-5 text-orange-600"
                        : "h-3 w-3 text-neutral-600",
                      "transition-all ease-in-out",
                    )}
                  />
                  <p className="text-[10px] text-white">History</p>
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
