import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { FaReceipt } from "react-icons-all-files/fa/FaReceipt";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { classNames } from "~/utils/classNames";
interface NavItems {
  label: string;
  href: string;
  Icon: IconType;
}

const navItems: NavItems[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    Icon: MdDashboard as IconType,
  },
  {
    label: "Reimbursements",
    href: "/reimbursements",
    Icon: FaReceipt as IconType,
  },
  {
    label: "Approvals",
    href: "/approvals",
    Icon: HiCheckCircle as IconType,
  },
  {
    label: "Profile",
    href: "/profile",
    Icon: MdPerson as IconType,
  },
];

interface NavigationProps {
  collapsed: boolean;
}
const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { pathname } = useRouter();
  return (
    <div className="flex flex-col gap-2">
      {navItems.map((item) => {
        const { label, href, Icon } = item;
        const active = pathname.includes(href);

        return (
          <Link
            className={classNames(
              !active && "hover:bg-[#ffffff] hover:bg-opacity-5",
              "relative flex h-11 items-center gap-2 rounded-[4px] p-2 text-white transition-all ease-in-out ",
            )}
            key={item.href}
            href={href}
          >
            {active && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: "16%" }}
                  exit={{ opacity: 0 }}
                  style={{ position: "absolute", left: 0 }}
                  className="h-full w-full rounded-sm bg-[#fcfcfc]"
                />
              </AnimatePresence>
            )}
            <div
              className={classNames(
                collapsed ? "gap-4" : "gap-2",
                !active && collapsed && "w-full justify-center",
                "flex h-full items-center",
              )}
            >
              {active && (
                <div className="relative h-full">
                  <AnimatePresence>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: ".25rem" }}
                      exit={{ width: 0 }}
                      style={{ position: "absolute", top: 0, left: 0 }}
                      className="h-[1.8rem] w-1 rounded-sm bg-primary-normal"
                    />
                  </AnimatePresence>
                </div>
              )}

              <Icon
                className={classNames(
                  collapsed ? "h-6 w-6" : "h-5 w-5",
                  "transition-all ease-in-out",
                )}
              />
            </div>

            {!collapsed && <p className="tracking-wider">{label}</p>}
          </Link>
        );
      })}
    </div>
  );
};

export default Navigation;