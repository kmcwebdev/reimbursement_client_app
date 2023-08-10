import React from "react";
const user = { firstName: "John", lastName: "Doe" };

const ProfileMenu: React.FC = () => {
  return (
    <div
      role="button"
      className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-lg font-bold text-neutral-normal"
    >
      {user.firstName.charAt(0).toUpperCase()}
      {user.lastName.charAt(0).toUpperCase()}
    </div>
  );
};

export default ProfileMenu;
