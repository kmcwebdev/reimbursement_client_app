import { useLogoutFunction } from "@propelauth/nextjs/client";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineLogout } from "react-icons-all-files/ai/AiOutlineLogout";
import { MdPeople } from "react-icons-all-files/md/MdPeople";
import { type PropsValue } from "react-select";
import { useAppSelector } from "~/app/hook";
import { useUserContext, type IRole } from "~/context/UserContext";
import { useDialogState } from "~/hooks/use-dialog-state";
import { Button } from "../../Button";
import Dialog from "../../Dialog";
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
  const { user: tempUser, changeUser } = useUserContext();

  const user = useAppSelector((state) => state.session.user);

  const {
    isVisible: signoutDialogIsOpen,
    open: openSignoutDialog,
    close: closeSignoutDialog,
  } = useDialogState();

  const logoutFn = useLogoutFunction();

  const navigation = useRouter();
  return (
    <Popover
      btn={
        <div
          role="button"
          className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 font-bold text-neutral-800"
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
            className="flex cursor-pointer items-center gap-4 rounded p-2 transition-all ease-in-out hover:bg-orange-300"
            onClick={() => navigation.push("/user-management")}
          >
            <MdPeople className="h-5 w-5 text-orange-600" />
            User Management
          </div>

          <Button
            variant="neutral"
            buttonType="text"
            onClick={openSignoutDialog}
          >
            <div className="flex items-center gap-1">
              <AiOutlineLogout className="h-4 w-4" />
              Sign out
            </div>
          </Button>

          <Dialog
            title="Confirm Signout?"
            isVisible={signoutDialogIsOpen}
            close={closeSignoutDialog}
          >
            <div className="flex flex-col gap-8 pt-8">
              <p className="text-neutral-800">
                Are you sure you want to end your session?
              </p>

              <div className="flex gap-4">
                <Button
                  buttonType="outlined"
                  variant="neutral"
                  className="w-1/2"
                  onClick={closeSignoutDialog}
                >
                  No
                </Button>
                <Button
                  variant="danger"
                  className="w-1/2"
                  onClick={() => void logoutFn()}
                >
                  Yes
                </Button>
              </div>
            </div>
          </Dialog>
        </div>
      }
    />
  );
};

export default ProfileMenu;
