import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { classNames } from "~/utils/classNames";

interface NavigationItemProps {
  href: string;
  active: boolean;
  collapsed: boolean;
  icon: IconType;
  label: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  active,
  href,
  collapsed,
  icon: Icon,
  label,
}) => {
  const navigation = useRouter();
  return (
    <div
      className={classNames(
        !active && "hover:bg-white hover:bg-opacity-5",
        "relative flex h-11 items-center gap-2 rounded-[4px] p-2 text-white transition-all ease-in-out ",
      )}
      key={href}
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
};

export default NavigationItem;
