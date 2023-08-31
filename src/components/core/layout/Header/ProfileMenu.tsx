import { useRouter } from "next/navigation";
import React from "react";
import { MdPeople } from "react-icons-all-files/md/MdPeople";
import { type PropsValue } from "react-select";
import { useAppSelector } from "~/app/hook";
import { useUserAccessContext, type IRole } from "~/context/AccessContext";
import Popover from "../../Popover";
import Select, { type OptionData } from "../../form/fields/Select";

const options = [
  {
    label: "EMPLOYEE",
    value: "employee",
  },
  {
    label: "HRBP",
    value: "hrbp",
  },
  {
    label: "MANAGER",
    value: "manager",
  },
  {
    label: "FINANCE",
    value: "finance",
  },
];

const ProfileMenu: React.FC = () => {
  const { user: tempUser, changeUser } = useUserAccessContext();

  const [user] = useAppSelector((state) => [state.session.user]);

  const navigation = useRouter();
  return (
    <Popover
      btn={
        <div
          role="button"
          className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 font-bold text-neutral-default"
        >
          <div className="relative grid h-5 w-5 place-items-center">
            <>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </>
          </div>
        </div>
      }
      panelClassName="right-0 top-5"
      content={
        <div className="w-72 space-y-4 p-4">
          <Select
            initialValue={
              options.find((a) => a.value === tempUser?.role) as OptionData
            }
            name="user"
            options={options}
            onChangeEvent={(e: PropsValue<OptionData>) => {
              const value = e as OptionData;
              changeUser(value.value as IRole);
            }}
          />
          <div
            className="flex cursor-pointer items-center gap-4 rounded p-2 transition-all ease-in-out hover:bg-primary-subtle"
            onClick={() => navigation.push("/user-management")}
          >
            <MdPeople className="h-5 w-5 text-primary-default" />
            User Management
          </div>
        </div>
      }
    />
  );
};

export default ProfileMenu;
