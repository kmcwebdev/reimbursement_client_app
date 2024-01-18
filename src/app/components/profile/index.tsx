"use client";
import { type NextPage } from "next";
import { type IconType } from "react-icons-all-files";
import { FaUserTie } from "react-icons-all-files/fa/FaUserTie";
import { HiBriefcase } from "react-icons-all-files/hi/HiBriefcase";
import { MdMail } from "react-icons-all-files/md/MdMail";
import { MdOutlineList } from "react-icons-all-files/md/MdOutlineList";
import { useAppSelector } from "~/app/hook";
import { classNames } from "~/utils/classNames";
import EmptyState from "../core/EmptyState";

const Profile: NextPage = () => {
  const { user, assignedRole } = useAppSelector((state) => state.session);
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="flex flex-col items-center gap-8 rounded-md bg-white p-8 shadow-sm md:flex-row md:items-start">
        <div className="h-40 w-40 rounded-full border border-orange-600 p-1">
          <div className="grid h-full w-full place-items-center rounded-full bg-neutral-300 font-barlow font-bold text-orange-600">
            <h1 className="text-7xl">
              {user && user.first_name?.charAt(0)}
              {user && user.last_name?.charAt(0)}
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex gap-4">
            <h1 className="uppercase text-navy">
              {user && user.first_name} {user && user.last_name}
            </h1>
          </div>
          <div className="flex flex-col gap-2 font-bold">
            <div className="flex items-center gap-2 text-neutral-700">
              <HiBriefcase className="h-5 w-5" />
              <p className="mt-0.5">
                {(user && user.profile.organization) || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <FaUserTie className="h-5 w-5" />
              <p className="mt-0.5">{assignedRole}</p>
            </div>

            <div className="flex items-center gap-2 text-neutral-700">
              <MdMail className="h-5 w-5" />
              <p className="mt-0.5">{user && user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid h-[50vh] grid-cols-1 gap-4">
        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h4>Permissions</h4>

          {user && user.permissions.length === 0 && (
            <div className="grid h-full w-full place-items-center rounded-md bg-neutral-100">
              <EmptyState
                icon={MdOutlineList as IconType}
                title="No Permissions assigned"
                description=""
              />
            </div>
          )}

          {user &&
            user.permissions.length > 0 &&
            user?.permissions.map((permission) => (
              <div
                key={permission}
                className={classNames(
                  "flex cursor-pointer items-center gap-2 rounded-md border border-transparent bg-neutral-200 p-4 font-bold transition-all ease-in-out hover:border-orange-600 hover:bg-orange-50 ",
                )}
              >
                {permission}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
