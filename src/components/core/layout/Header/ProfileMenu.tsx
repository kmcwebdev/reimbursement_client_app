import React from "react";
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
              user
                ? { label: user.name.toUpperCase(), value: user.role }
                : undefined
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onChangeEvent={(e) => {
              const event = e as OptionData;
              console.log(event);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              changeUser(event.value as IRole);
            }}
          />
        </div>
      }
    />
  );
};

export default ProfileMenu;
