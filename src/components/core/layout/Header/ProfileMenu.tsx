import { useLogoutFunction } from "@propelauth/nextjs/client";
import React, { useRef, useState } from "react";
import { AiOutlineLogout } from "react-icons-all-files/ai/AiOutlineLogout";
import { MdChangeCircle } from "react-icons-all-files/md/MdChangeCircle";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";
import { type PropsValue } from "react-select";
import { useAppSelector } from "~/app/hook";
import { useChangeRoleMutation } from "~/features/reimbursement-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { Button } from "../../Button";
import Dialog from "../../Dialog";
import Popover from "../../Popover";
import Select, { type OptionData } from "../../form/fields/Select";

const roleOptions = [
  {
    value: "HRBP",
    label: "HRBP",
  },
  {
    label: "Manager",
    value: "External Reimbursement Approver Manager",
  },

  {
    value: "Finance",
    label: "Finance",
  },

  {
    value: "Member",
    label: "Member",
  },
];

const ProfileMenu: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonChildRef = useRef<HTMLButtonElement>(null);
  const user = useAppSelector((state) => state.session.user);
  const [signoutButtonIsLoading, setSignoutButtonIsLoading] =
    useState<boolean>(false);

  const {
    isVisible: signoutDialogIsOpen,
    open: openSignoutDialog,
    close: closeSignoutDialog,
  } = useDialogState();

  const [changeRole, { isLoading: changeRoleIsLoading }] =
    useChangeRoleMutation();
  const logoutFn = useLogoutFunction();

  const onRoleChanged = (selected: PropsValue<OptionData>) => {
    const selectedOption = selected as OptionData;

    if (user && user.orgId) {
      buttonChildRef.current?.click();
      const payload = {
        org_id: user.orgId,
        role: selectedOption.value,
      };
      void changeRole(payload)
        .unwrap()
        .then(() => {
          window.location.reload();
          buttonRef.current?.click();
        });
    }
  };
  const handleSignout = () => {
    setSignoutButtonIsLoading(true);
    void logoutFn().then(() => {
      setSignoutButtonIsLoading(false);
      closeSignoutDialog();
    });
  };

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
        <div className="relative w-72">
          <div className="flex gap-4 border-b p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-600 text-lg font-bold text-white">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <p className="font-bold uppercase text-orange-600">
                {user?.firstName} {user?.lastName}
              </p>

              <div className="flex flex-col gap-2">
                <p className="text-xs text-neutral-600">{user?.assignedRole}</p>
                  <Popover
                    panelClassName="-translate-x-1/2"
                    buttonRef={buttonChildRef}
                    btn={
                      <div className="flex items-center gap-1 text-xs text-yellow-600 transition-all ease-in-out hover:text-yellow-700">
                        <MdChangeCircle className="h-4 w-4" />
                        <p>Change Role</p>
                      </div>
                    }
                    content={
                      <div className="w-40">
                        <Select
                          name="role"
                          onChangeEvent={onRoleChanged}
                          options={roleOptions}
                        />
                      </div>
                    }
                  />
              </div>
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
                  loading={signoutButtonIsLoading}
                  onClick={handleSignout}
                >
                  Yes
                </Button>
              </div>
            </div>
          </Dialog>

          {changeRoleIsLoading && (
            <div className="absolute top-0 grid h-full w-full place-items-center rounded-md bg-white">
              <div className="flex flex-col items-center gap-2">
                <RiLoader4Fill className="h-16 w-16 animate-spin text-orange-600" />
                <h5>Changing your role,please wait...</h5>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

export default ProfileMenu;
