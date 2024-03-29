import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import { AiOutlineLogout } from "react-icons-all-files/ai/AiOutlineLogout";
import { MdChangeCircle } from "react-icons-all-files/md/MdChangeCircle";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";
import { type PropsValue } from "react-select";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useAllGroupsQuery } from "~/features/api/references-api-slice";
import { useAssignGroupMutation } from "~/features/api/user-api-slice";
import {
  clearUserSession,
  setAssignedRole,
} from "~/features/state/user-state.slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { type GroupType } from "~/types/reimbursement.types";
import { Button } from "../../Button";
import Dialog from "../../Dialog";
import Popover from "../../Popover";
import Select, { type OptionData } from "../../form/fields/Select";

const ProfileMenu: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonChildRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, assignedRole } = useAppSelector((state) => state.session);
  const [signoutButtonIsLoading, setSignoutButtonIsLoading] =
    useState<boolean>(false);

  const {
    isVisible: signoutDialogIsOpen,
    open: openSignoutDialog,
    close: closeSignoutDialog,
  } = useDialogState();

  const logoutFn = async () => {
    await signOut().then(() => {
      dispatch(clearUserSession());
      closeSignoutDialog();
      router.refresh();
    });
  };

  const [groupOptions, setGroupOptions] = useState<OptionData[]>();

  const [assignGroup, { isLoading: isSubmitting }] = useAssignGroupMutation();

  const { isFetching, data } = useAllGroupsQuery(
    {},
    { skip: !user?.is_staff || !user?.profile },
  );

  useMemo(() => {
    if (data?.results) {
      const options: OptionData[] = [];

      data.results.forEach((res) => {
        options.push({
          value: res.id,
          label: res.name,
        });
      });

      setGroupOptions(options);
    }
  }, [data]);

  const onRoleChanged = (selected: PropsValue<OptionData>) => {
    if (user) {
      const selectedOption = selected as OptionData;

      void assignGroup({ id: user.id, group_id: +selectedOption.value })
        .unwrap()
        .then(() => {
          dispatch(setAssignedRole(selectedOption.label as GroupType));
          buttonChildRef.current?.click();
          buttonRef.current?.click();
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        });
    }
  };

  const handleSignout = async () => {
    setSignoutButtonIsLoading(true);
    await logoutFn();
  };

  return (
    <Popover
      ariaLabel={`${user?.first_name?.charAt(0)}
              ${user?.last_name?.charAt(0)}`}
      buttonRef={buttonRef}
      btn={
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 font-bold text-neutral-800">
          <div className="relative grid h-5 w-5 place-items-center">
            <p>
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </p>
          </div>
        </div>
      }
      panelClassName="right-0 top-5"
      content={
        <div className="relative w-72">
          <div className="flex gap-4 border-b p-4">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-orange-600 text-md font-bold text-white">
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <p className="font-bold uppercase text-orange-600">
                {user?.first_name} {user?.last_name}
              </p>
              <div className="text-xs">
                {user?.is_superuser
                  ? "ADMINISTRATOR"
                  : assignedRole
                    ? assignedRole?.split("_")[1]
                    : "No Groups Assigned"}
              </div>

              {typeof window !== "undefined" &&
                (window.location.origin.includes("http://localhost") ||
                  window.location.origin.includes(
                    "https://reimbursement-client-app-staging.vercel.app",
                  )) &&
                user?.is_superuser &&
                assignedRole && (
                  <div className="mt-1 flex flex-col gap-2">
                    <div className="h-px w-full bg-neutral-200" />
                    <Popover
                      ariaLabel="Assigned Role"
                      panelClassName="-translate-y-2"
                      buttonRef={buttonChildRef}
                      btn={
                        <div className="flex w-full items-center justify-between rounded-md border border-neutral-300 px-4 py-2 text-xs text-yellow-600 transition-all ease-in-out hover:border-orange-600">
                          <p>{assignedRole?.split("_")[1]}</p>
                          <MdChangeCircle className="h-5 w-5" />
                        </div>
                      }
                      content={
                        <div className="flex w-[12.5rem] flex-col gap-4">
                          <Select
                            name="role"
                            onChangeEvent={onRoleChanged}
                            isLoading={isFetching}
                            options={
                              groupOptions
                                ?.filter((a) => a.label !== assignedRole)
                                .map((group) => ({
                                  value: group.value,
                                  label: group.label.split("_")[1],
                                })) || []
                            }
                          />
                        </div>
                      }
                    />
                  </div>
                )}
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4">
            <Button
              aria-label="Sign out"
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
                  aria-label="No"
                  buttonType="outlined"
                  variant="neutral"
                  className="w-1/2"
                  onClick={closeSignoutDialog}
                >
                  No
                </Button>
                <Button
                  aria-label="Yes"
                  variant="danger"
                  className="w-1/2"
                  loading={signoutButtonIsLoading}
                  onClick={() => void handleSignout()}
                >
                  Yes
                </Button>
              </div>
            </div>
          </Dialog>

          {isSubmitting && (
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
