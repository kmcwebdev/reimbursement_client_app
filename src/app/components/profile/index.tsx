"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserTie } from "react-icons-all-files/fa/FaUserTie";
import { HiBriefcase } from "react-icons-all-files/hi/HiBriefcase";
import { MdMail } from "react-icons-all-files/md/MdMail";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useChangePasswordMutation } from "~/features/api/actions-api-slice";
import { clearUserSession } from "~/features/state/user-state.slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { changePasswordSchema } from "~/schema/change-password.schema";
import {
  type ChangePassword,
  type ChangePasswordPayload,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { Button } from "../core/Button";
import Dialog from "../core/Dialog";
import StatusBadge from "../core/StatusBadge";
import { showToast } from "../core/Toast";
import Form from "../core/form";
import Input from "../core/form/fields/Input";

const Profile: NextPage = () => {
  const { user, assignedRole, accessToken } = useAppSelector(
    (state) => state.session,
  );
  const { isVisible, open, close } = useDialogState();
  const [payload, setPayload] = useState<ChangePasswordPayload>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [changePasswordMutation, { isLoading: isSubmitting }] =
    useChangePasswordMutation();

  const formReturn = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const onAbort = () => {
    close();
  };

  const handleSubmit = (data: ChangePassword) => {
    if (user && accessToken) {
      const payload = {
        email: user.email,
        new_password: data.password,
        token: accessToken,
      };
      setPayload(payload);
      open();
    }
  };

  const handleConfirmChangePassword = () => {
    if (payload) {
      void changePasswordMutation(payload)
        .unwrap()
        .then(async () => {
          showToast({
            type: "success",
            description: "Password has been changed successfully",
          });
          setPayload(payload);
          formReturn.reset();
          await signOut().then(() => {
            dispatch(clearUserSession());
            close();
            router.refresh();
          });
        })
        .catch((error: RtkApiError) => {
          showToast({
            type: "error",
            description: error.data.detail,
          });
        });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {user && !user.profile && (
        <div className=" rounded-r-md border-l-4 border-red-600 bg-red-100 p-4 font-medium ">
          <h4 className="text-red-600">Missing Information</h4>
          <p className="text-neutral-900">
            Your profile appears to be either incomplete or missing. Please
            reach out to your account manager for assistance.
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col items-center gap-8 rounded-md bg-white p-8 shadow-sm md:flex-row md:items-start">
        <div className="h-40 w-40 rounded-full border border-orange-600 p-1">
          <div className="grid h-full w-full place-items-center rounded-full bg-neutral-300 font-barlow font-bold text-orange-600">
            <h1 className="text-7xl">
              {user && user.first_name?.charAt(0)}
              {user && user.last_name?.charAt(0)}
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex gap-4">
            <h1 className="uppercase text-navy">
              {user && user.first_name} {user && user.last_name}
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            {user?.is_superuser && (
              <StatusBadge status="pending" label="Administrator" />
            )}
            <div className="flex items-center gap-2 text-neutral-700">
              <HiBriefcase className="h-5 w-5" />
              <p className="mt-0.5">
                {(user && user.profile && user.profile.organization) ||
                  "No Assigned Organization"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <FaUserTie className="h-5 w-5" />
              <p className="mt-0.5">{assignedRole || "No Assigned Group"}</p>
            </div>

            <div className="flex items-center gap-2 text-neutral-700">
              <MdMail className="h-5 w-5" />
              <p className="mt-0.5">{user && user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid h-[50vh] grid-cols-1 gap-4">
        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h4>Account Settings</h4>

          <div className="grid h-full w-full rounded-md">
            <div className="flex gap-4">
              <div className="flex w-2/12 flex-col gap-4">
                <div className="flex h-10 items-center rounded-md bg-neutral-300 px-4 font-medium text-orange-600">
                  Change Password
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 border-l p-4">
                <p className="font-medium">
                  Enter new password for your account.
                </p>

                <Form
                  useFormReturn={formReturn}
                  name="change-password"
                  onSubmit={handleSubmit}
                  className="flex w-1/3 flex-col gap-4"
                >
                  <Input
                    label="New Password"
                    type="password"
                    name="password"
                    placeholder="New Password"
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="New Password"
                  />

                  <div className="mt-4 flex justify-end">
                    <Button
                      type="submit"
                      disabled={!formReturn.formState.isValid}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
            {/* <EmptyState
              icon={FaTools as IconType}
              title="Under Development"
              description="This page is currently under development"
            /> */}
          </div>

          {/* {user &&
            user.permissions.length > 0 &&
            user?.permissions.map((permission) => (
              <div
                key={permission}
                className={classNames(
                  "flex cursor-pointer items-center gap-2 rounded-md border border-transparent bg-neutral-200 p-4 font-bold transition-all ease-in-out hover:border-orange-600 hover:bg-orange-50 ",
                )}
              >
                {permission}
              </div>
            ))} */}
        </div>
      </div>

      <Dialog
        title="Confirm Password Change?"
        isVisible={isVisible}
        close={onAbort}
      >
        <div className="flex flex-col gap-8 pt-8">
          <p className="text-neutral-800">
            Are you sure you set a new password?
          </p>

          <div className="flex items-center gap-4">
            <Button
              aria-label="No"
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={onAbort}
              disabled={isSubmitting}
            >
              No
            </Button>
            <Button
              aria-label="Yes"
              variant="danger"
              className="w-1/2"
              onClick={handleConfirmChangePassword}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Yes
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Profile;
