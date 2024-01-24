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
import { type IGroupType } from "~/types/group.type";
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
    await signOut({ redirect: false }).then(() => {
      dispatch(clearUserSession());
      closeSignoutDialog();
      router.push("/auth/login");
    });
  };

  const [groupOptions, setGroupOptions] = useState<OptionData[]>();

  const [assignGroup, { isLoading: isSubmitting }] = useAssignGroupMutation();

  const { isFetching, data } = useAllGroupsQuery({}, { skip: !user?.is_staff });

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
          dispatch(setAssignedRole(selectedOption.label as IGroupType));
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
      buttonRef={buttonRef}
      btn={
        <div
          role="button"
          className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 font-bold text-neutral-800"
        >
          <div className="relative grid h-5 w-5 place-items-center">
            <>
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </>
          </div>
        </div>
      }
      panelClassName="right-0 top-5"
      content={
        <div className="relative w-72">
          <div className="flex gap-4 border-b p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-600 text-lg font-bold text-white">
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <p className="font-bold uppercase text-orange-600">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-neutral-600">{assignedRole}</p>
              {typeof window !== "undefined" &&
                (window.location.origin.includes("http://localhost") ||
                  window.location.origin.includes(
                    "https://reimbursement-client-app-staging.vercel.app",
                  )) &&
                user?.is_superuser && (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-8">
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
                          <div className="flex w-60 flex-col gap-4">
                            <Select
                              name="role"
                              onChangeEvent={onRoleChanged}
                              isLoading={isFetching}
                              options={
                                groupOptions
                                  ?.filter((a) => a.label !== assignedRole)
                                  .map((group) => ({
                                    value: group.value,
                                    label: group.label,
                                  })) || []
                              }
                            />
                          </div>
                        }
                      />
                    </div>
                  </div>
                )}
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
