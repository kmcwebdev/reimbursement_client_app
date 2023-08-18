
import { useRouter } from "next/navigation";
import React from "react";
import { MdPeople } from 'react-icons-all-files/md/MdPeople';
import { type PropsValue } from "react-select";
import { useUserAccessContext, type IRole } from "~/context/AccessContext";
import Popover from "../../Popover";
import Select, { type OptionData } from "../../form/fields/Select";

const ProfileMenu: React.FC = () => {
  const { user, changeUser } = useUserAccessContext();
  return (
    <Popover
      btn={
        <div
          role="button"
          className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 font-bold text-neutral-default"
        >
          {user?.name.charAt(0).toUpperCase()}
        </div>
      }
      panelClassName="right-0 top-5"
      content={
        <div className="w-72 p-4">
          <Select
            name="user"
            data={[
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
              {
                label: "SAMPLE",
                value: "sample",
              },
            ]}
            initialValue={
              options.find((a) => a.value === user?.role) as OptionData
            }
            name="user"
            options={options}
            onChangeEvent={(e: PropsValue<OptionData>) => {
              const value = e as OptionData;
              changeUser(value.value as IRole);
            }}
          />
          <div className="p-2 flex items-center gap-4 rounded hover:bg-primary-subtle transition-all ease-in-out cursor-pointer" onClick={() => navigation.push('/user-management')} ><MdPeople className="h-5 w-5 text-primary-default" />User Management</div>
        </div>
      }
    />
  );
};

export default ProfileMenu;
