/* eslint-disable @typescript-eslint/unbound-method */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, type PropsWithChildren } from "react";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { resetPageTableState } from "~/features/state/table-state.slice";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import { classNames } from "~/utils/classNames";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAppSelector((state) => state.session);
  const { push } = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  /**
   * This resets the page table filter to its initial state on every
   * router pathname change
   */
  useEffect(() => {
    if (pathname) {
      dispatch(resetPageTableState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (pathname.includes("/auth")) {
    return (
      <main
        className={classNames(
          `${karla.variable} ${barlow_Condensed.variable} h-screen w-screen flex-1 overflow-y-auto bg-neutral-200 font-karla`,
        )}
      >
        <div className="grid h-full w-full place-items-center">{children}</div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      {!pathname.includes("email-action") && <Sidebar />}

      <main
        className={classNames(
          `${karla.variable} ${barlow_Condensed.variable} w-full flex-1 overflow-y-auto bg-neutral-100 font-karla`,
        )}
      >
        <Header />
        <div className="relative flex h-[calc(100vh_-_4rem)] w-full flex-col">
          <div
            className={classNames(
              "relative h-full w-full overflow-hidden overflow-y-auto bg-neutral-100",
            )}
          >
            {children}
          </div>
          <div className="absolute h-16" />

          <div className="z-[50] flex h-16 items-center justify-evenly border-t bg-black px-8 md:hidden">
            <div className="flex flex-col items-center justify-center gap-1">
              <Link href="/dashboard">
                <MdDashboard
                  className={classNames(
                    pathname.includes("dashboard")
                      ? "h-5 w-5 text-orange-600"
                      : "h-3 w-3 text-neutral-600",
                    "transition-all ease-in-out",
                  )}
                />

                <p className="text-[10px] text-white">Dashboard</p>
              </Link>
            </div>

            {user && user.groups[0] === "REIMBURSEMENT_MANAGER" && (
              <div
                className="flex flex-col items-center justify-center gap-1"
                onClick={() => void push("/approval")}
              >
                <MdGavel
                  className={classNames(
                    pathname.includes("approval")
                      ? "h-5 w-5 text-orange-600"
                      : "h-3 w-3 text-neutral-600",
                    "transition-all ease-in-out",
                  )}
                />
                <p className="text-[10px] text-white">Approval</p>
              </div>
            )}
            {user &&
              (user.groups[0] === "REIMBURSEMENT_FINANCE" ||
                user.groups[0] === "REIMBURSEMENT_HRBP" ||
                user.groups[0] === "REIMBURSEMENT_MANAGER") && (
                <div
                  className="flex flex-col items-center justify-center gap-1"
                  onClick={() => void push("/history")}
                >
                  <MdReceipt
                    className={classNames(
                      pathname.includes("history")
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
              onClick={() => void push("/profile")}
            >
              <MdPerson
                className={classNames(
                  pathname.includes("profile")
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
