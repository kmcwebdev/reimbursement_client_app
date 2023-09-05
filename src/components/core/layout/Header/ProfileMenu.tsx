import { useLogoutFunction } from "@propelauth/nextjs/client";
import React, { useRef } from "react";
import { AiOutlineLogout } from "react-icons-all-files/ai/AiOutlineLogout";
import { useAppSelector } from "~/app/hook";
import { useDialogState } from "~/hooks/use-dialog-state";
import { Button } from "../../Button";
import Dialog from "../../Dialog";
import Popover from "../../Popover";

const ProfileMenu: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const user = useAppSelector((state) => state.session.user);

  const {
    isVisible: signoutDialogIsOpen,
    open: openSignoutDialog,
    close: closeSignoutDialog,
  } = useDialogState();

  const logoutFn = useLogoutFunction();

  return (
    <Popover
      buttonRef={buttonRef}
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
        <div className="w-72">
          <div className="flex gap-4 border-b p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-600 text-lg font-bold text-white">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <p className="font-bold uppercase text-orange-600">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="text-xs text-neutral-600">{user?.assignedRole}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4">
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
          </div>

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
