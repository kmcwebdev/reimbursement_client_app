import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { MdEdit } from "react-icons-all-files/md/MdEdit";
import { MdMail } from "react-icons-all-files/md/MdMail";
import { useAppSelector } from "~/app/hook";
import { useReRouteApproverMutation } from "~/features/api/actions-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
  ApproverSchema,
  type Approver,
} from "~/schema/reimbursement-approver.schema";
import {
  type IApproverMatrix,
  type IStatus,
} from "~/types/reimbursement.types";
import { parseTimezone } from "~/utils/parse-timezone";
import { Button } from "../core/Button";
import Dialog from "../core/Dialog";
import { showToast } from "../core/Toast";
import Form from "../core/form";
import Input from "../core/form/fields/Input";

dayjs.extend(timezone);
interface ApproversProps {
  approvers: IApproverMatrix[];
  request_status: IStatus;
}

export interface IApproverToEdit {
  approver_matrix_id: number;
  prev_approver_email: string;
  prev_approver_group: string;
}

const Approvers: React.FC<ApproversProps> = ({ approvers, request_status }) => {
  const { user } = useAppSelector((state) => state.session);
  const pathname = usePathname();
  const { isVisible, open, close } = useDialogState();
  const [approverToEdit, setApproverToEdit] = useState<IApproverToEdit>();

  const [reRouteApprover, { isLoading: isReRouting }] =
    useReRouteApproverMutation();

  const useSetApproverFormReturn = useForm<Approver>({
    resolver: zodResolver(ApproverSchema),
    mode: "onChange",
  });

  const handleSubmit = (e: Approver) => {
    if (approverToEdit) {
      const payload = {
        ...approverToEdit,
        new_approver_email: e.manager_approver_email,
      };
      void reRouteApprover(payload)
        .unwrap()
        .then(() => {
          close();
          useSetApproverFormReturn.reset();
          setApproverToEdit(undefined);
          showToast({
            type: "success",
            description: "New Approver has been set successfully.",
          });
        })
        .catch((error: { status: number; data: { detail: string } }) => {
          showToast({ type: "error", description: error.data.detail });
        });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 py-4">
        <h6 className="text-base font-semibold">Approvers</h6>

        {approvers.map((approver) => (
          <div key={approver.id} className="flex flex-col gap-4">
            <div className="flex gap-4">
              {!approver.is_approved && !approver.is_rejected && (
                <MdAccessTimeFilled className="mt-0.1 h-4 w-4 text-yellow-600" />
              )}

              {approver.is_rejected && (
                <MdClose className="h-4 w-4 text-red-600" />
              )}

              {approver.is_approved && (
                <HiCheckCircle className="mt-0.1 h-4 w-4 text-green-600" />
              )}

              <div className="flex flex-1 flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-900">
                    {approver.approver
                      ? approver.approver.email
                      : approver.display_name}
                  </span>

                  {!approver.is_approved &&
                    approver.display_name !== "Finance" &&
                    pathname === "/admin" &&
                    user?.is_superuser && (
                      <Button
                        buttonType="text"
                        onClick={() => {
                          setApproverToEdit({
                            approver_matrix_id: approver.id,
                            prev_approver_email: approver.approver.email,
                            prev_approver_group: approver.approver.groups[0],
                          });
                          open();
                        }}
                      >
                        <MdEdit className="h-5 w-5" />
                      </Button>
                    )}
                </div>

                {approver.acknowledge_datetime ? (
                  <div className="flex justify-between">
                    <>
                      <p className="text-xs text-neutral-600">
                        {parseTimezone(approver.acknowledge_datetime).format(
                          "MMM D, YYYY",
                        )}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {parseTimezone(approver.acknowledge_datetime).format(
                          "hh:mm A",
                        )}
                      </p>
                    </>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-600">
                    Pending for Approval
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {request_status.name === "Approved" && (
          <div>
            <p className="text-sm text-neutral-800">
              Waiting for Payment Processing...
            </p>
          </div>
        )}
      </div>

      <Dialog isVisible={isVisible} close={close} title="Set New Approver">
        <Form
          name="particular-form"
          useFormReturn={useSetApproverFormReturn}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 pt-4"
        >
          <div className="relative">
            <Input
              label="Approver"
              icon={MdMail as IconType}
              name="manager_approver_email"
              placeholder="New Approver"
            />
          </div>

          <div className="grid grid-cols-2 items-center gap-2 pt-4">
            <div>
              <Button
                aria-label="Return"
                type="button"
                buttonType="outlined"
                variant="neutral"
                className="w-full"
                onClick={() => {
                  close();
                  setApproverToEdit(undefined);
                  useSetApproverFormReturn.reset();
                }}
              >
                Cancel
              </Button>
            </div>

            <Button
              aria-label="Submit"
              type="submit"
              className="w-full"
              loading={isReRouting}
            >
              Update
            </Button>
          </div>
        </Form>
      </Dialog>
    </>
  );
};

export default Approvers;
