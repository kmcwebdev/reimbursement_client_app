import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MdAdminPanelSettings } from "react-icons-all-files/md/MdAdminPanelSettings";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { useAppSelector } from "~/app/hook";
import { classNames } from "~/utils/classNames";

const MobileNav: React.FC = () => {
  const { assignedRole, user } = useAppSelector((state) => state.session);
  const pathname = usePathname();

  return (
    <div className="z-[50] flex h-16 items-center justify-evenly border-t bg-black px-8 md:hidden">
      {user?.is_superuser && (
        <Link href="/admin">
          <div className="flex flex-col items-center justify-center gap-1">
            <MdAdminPanelSettings
              className={classNames(
                pathname && pathname === "/admin"
                  ? "h-5 w-5 text-orange-600"
                  : "h-3 w-3 text-neutral-600",
                "transition-all ease-in-out",
              )}
            />

            <p className="text-[10px] text-white">Admin</p>
          </div>
        </Link>
      )}

      <Link href="/dashboard">
        <div className="flex flex-col items-center justify-center gap-1">
          <MdDashboard
            className={classNames(
              pathname && pathname === "/dashboard"
                ? "h-5 w-5 text-orange-600"
                : "h-3 w-3 text-neutral-600",
              "transition-all ease-in-out",
            )}
          />

          <p className="text-[10px] text-white">Dashboard</p>
        </div>
      </Link>

      {assignedRole === "REIMBURSEMENT_MANAGER" && (
        <Link href="/approval">
          <div className="flex flex-col items-center justify-center gap-1">
            <MdGavel
              className={classNames(
                pathname && pathname === "/approval"
                  ? "h-5 w-5 text-orange-600"
                  : "h-3 w-3 text-neutral-600",
                "transition-all ease-in-out",
              )}
            />
            <p className="text-[10px] text-white">Approval</p>
          </div>
        </Link>
      )}

      {(assignedRole === "REIMBURSEMENT_FINANCE" ||
        assignedRole === "REIMBURSEMENT_HRBP" ||
        assignedRole === "REIMBURSEMENT_MANAGER") && (
        <Link href="/history">
          <div className="flex flex-col items-center justify-center gap-1">
            <MdReceipt
              className={classNames(
                pathname && pathname.includes("history")
                  ? "h-5 w-5 text-orange-600"
                  : "h-3 w-3 text-neutral-600",
                "transition-all ease-in-out",
              )}
            />
            <p className="text-[10px] text-white">History</p>
          </div>
        </Link>
      )}

      <Link href="/profile">
        <div className="flex flex-col items-center justify-center gap-1">
          <MdPerson
            className={classNames(
              pathname && pathname === "/profile"
                ? "h-5 w-5 text-orange-600"
                : "h-3 w-3 text-neutral-600",
              "transition-all ease-in-out",
            )}
          />
          <p className="text-[10px] text-white">Profile</p>
        </div>
      </Link>
    </div>
  );
};

export default MobileNav;
