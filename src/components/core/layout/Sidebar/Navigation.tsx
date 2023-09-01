import { AnimatePresence, motion } from "framer-motion";
import { useRouter as useNavigation } from "next/navigation";
import { useRouter } from "next/router";

import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
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
    label: "Approval",
    href: "/approval",
    Icon: MdGavel as IconType,
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
  const navigation = useNavigation();
  const { pathname } = useRouter();

  return (
    <div className="flex flex-col gap-2">
      {navItems.map((item) => {
        const { label, href, Icon } = item;
        const active = pathname.includes(href);

        return (
          <div
            className={classNames(
              !active && "hover:bg-white hover:bg-opacity-5",
              "relative flex h-11 items-center gap-2 rounded-[4px] p-2 text-white transition-all ease-in-out ",
            )}
            key={item.href}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => navigation.push(href)}
          >
            {active && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: "16%" }}
                  exit={{ opacity: 0 }}
                  style={{ position: "absolute", left: 0 }}
                  className="h-full w-full rounded-sm bg-neutral-50"
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
                <div className="relative flex h-full">
                  <AnimatePresence>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "2px" }}
                      exit={{ width: 0 }}
                      style={{ position: "absolute", top: 6, left: 0 }}
                      className="h-[16px] w-[2px] rounded-sm bg-orange-600"
                    />
                  </AnimatePresence>
                </div>
              )}

              <Icon
                className={classNames(
                  collapsed ? "h-6 w-6" : "h-[14px] w-[14px]",
                  "transition-all ease-in-out",
                )}
              />
            </div>

            {!collapsed && <p className="tracking-wider">{label}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default Navigation;
