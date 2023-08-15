import React from "react";
import Popover from "../../Popover";
const user = { firstName: "Jayzur", lastName: "Gandia" };

const ProfileMenu: React.FC = () => {
  return (
    <Popover
      btn={
        <div
          role="button"
          className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 font-bold text-neutral-default"
        >
          {user.firstName.charAt(0).toUpperCase()}
          {user.lastName.charAt(0).toUpperCase()}
        </div>
      }
      panelClassName="right-0 top-5"
      content={<div className="w-32 p-4">TO DO: Edit content</div>}
    />
  );
};

export default ProfileMenu;
