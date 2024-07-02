"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { HiExclamationCircle } from "react-icons-all-files/hi/HiExclamationCircle";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import EmptyState from "~/app/components/core/EmptyState";
import Form from "~/app/components/core/form";
import TextArea from "~/app/components/core/form/fields/TextArea";
import { rejectReimbursementSchema } from "~/schema/reimbursement-reject-form.schema";
import { type RejectReimbursementType } from "~/types/reimbursement.types";
import EmailActionApiService from "../api/services/email-action-service";

const EmailActionPage: React.FC = () => {
  const searchParams = useSearchParams();
  const {
    action_type,
    reference_no,
  }: { action_type: string; reference_no: string } = useParams<{
    reference_no: string;
    action_type: string;
  }>();

  const access_token = searchParams.get("access_token");
  const action_id = searchParams.get("action_id");
  const request_id = searchParams.get("request_id");

  const [canTakeAction, setCanTakeAction] = useState<boolean>(false);
  const {
    data: approvalStatus,
    isLoading: approvalStatusIsLoading,
    isError: approvalStatusIsError,
    error: approvalStatusError,
  } = EmailActionApiService.useApprovalStatus({
    id: request_id!,
    access_token: access_token!,
  });

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [actionError, setActionError] = useState<string>();
  const [isActionSucceeded, setIsActionSucceeded] = useState<boolean>(false);

  const { mutateAsync: approveMutation, isLoading: isApprovalLoading } =
    EmailActionApiService.useApproveReimbursement({
      onSuccess: () => {
        setIsActionSucceeded(true);
        useRejectFormReturn.reset();
      },
      onError: (error) => {
        setActionError(error.data.detail);
      },
    });

  const { mutateAsync: rejectMutation, isLoading: isRejectLoading } =
    EmailActionApiService.useRejectReimbursement({
      onSuccess: () => {
        setIsActionSucceeded(true);
        useRejectFormReturn.reset();
      },
      onError: (error) => {
        setActionError(error.data.detail);
      },
    });

  useEffect(() => {
    if (
      !approvalStatusIsLoading &&
      approvalStatus &&
      approvalStatus.detail.status.name === "Pending"
    ) {
      setCanTakeAction(true);
    }
  }, [approvalStatusIsLoading, approvalStatus]);

  useEffect(() => {
    if (
      action_type &&
      access_token &&
      action_id &&
      request_id &&
      reference_no &&
      canTakeAction
    ) {
      if (!isMounted) {
        setIsMounted(true);
      }
      if (isMounted) {
        if (action_type === "approve") {
          const payload = { id: request_id, action_id, access_token };
          void approveMutation(payload);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    action_type,
    access_token,
    action_id,
    request_id,
    reference_no,
    isMounted,
    canTakeAction,
  ]);

  const useRejectFormReturn = useForm<RejectReimbursementType>({
    resolver: zodResolver(rejectReimbursementSchema),
    mode: "onChange",
  });

  const handleConfirmReject = (values: RejectReimbursementType) => {
    if (request_id && access_token && action_id) {
      const payload = {
        id: request_id,
        action_id,
        access_token,
        remarks: values.remarks,
      };

      void rejectMutation(payload);
    }
  };

  const isInvalidUrl =
    (action_type !== "approve" && action_type !== "reject") ||
    !reference_no ||
    !request_id ||
    !access_token ||
    !action_id;

  return (
    <div className="grid h-full place-items-center p-4">
      {isInvalidUrl && (
        <EmptyState
          icon={MdGavel as IconType}
          title="Invalid Url"
          description="Please check your redirect url."
        />
      )}

      {!isInvalidUrl && (
        <div className="flex w-full  flex-col gap-4 rounded-md border bg-white p-4 shadow-md sm:w-96 lg:w-1/4">
          <div className="relative h-6 w-[101px]">
            <Image
              src="https://cdn.kmc.solutions/project-statics/KMC-logo-updated-black%20(1).png"
              alt="kmc-logo"
              sizes="100%"
              fill
            />
          </div>

          {/* APPROVED */}
          <CollapseHeightAnimation
            isVisible={canTakeAction && action_type === "approve"}
          >
            {isActionSucceeded && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="h-5 w-5 text-green-600" />
                  Approved
                </div>
                <p className="text-neutral-600">
                  {reference_no.toUpperCase()} has been approved
                </p>
              </div>
            )}

            {actionError && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <HiExclamationCircle className="h-5 w-5 text-red-600" />
                  Something went wrong!
                </div>
                <p className="text-neutral-600">{actionError}</p>
              </div>
            )}
          </CollapseHeightAnimation>

          {/* REJECTED */}
          <CollapseHeightAnimation
            isVisible={canTakeAction && action_type === "reject"}
          >
            {!actionError && !isActionSucceeded && (
              <Form
                name="rejectReimbursementForm"
                useFormReturn={useRejectFormReturn}
                onSubmit={handleConfirmReject}
              >
                <div className="flex flex-col gap-8 pt-4">
                  <TextArea
                    name="remarks"
                    label="Reasons for Rejection"
                    required
                  />

                  <Button
                    aria-label="Reject"
                    variant="danger"
                    type="submit"
                    loading={isRejectLoading}
                  >
                    Reject
                  </Button>
                </div>
              </Form>
            )}

            {isActionSucceeded && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MdClose className="h-5 w-5 text-red-600" />
                  Reject
                </div>
                <p className="text-neutral-600">
                  {reference_no.toUpperCase()} has been Rejected
                </p>
              </div>
            )}
            {actionError && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <HiExclamationCircle className="h-5 w-5 text-red-600" />
                  Something went wrong!
                </div>
                <p className="text-neutral-600">{actionError}</p>
              </div>
            )}
          </CollapseHeightAnimation>

          {/* ALREADY APPROVED/REJECTED */}
          <CollapseHeightAnimation
            isVisible={!approvalStatusIsLoading && !canTakeAction}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <HiExclamationCircle className="h-5 w-5 text-red-600" />
                Something went wrong!
              </div>

              {!approvalStatusIsError && approvalStatus && (
                <p className="text-neutral-600">
                  The request has already been{" "}
                  {approvalStatus.detail.status.name.toLowerCase()} by another
                  approver at the same approval level.
                </p>
              )}

              {approvalStatusIsError && approvalStatusError && (
                <p className="text-neutral-600">
                  {approvalStatusError.data.detail}
                </p>
              )}
            </div>
          </CollapseHeightAnimation>

          <CollapseHeightAnimation
            isVisible={
              approvalStatusIsLoading || isApprovalLoading || isRejectLoading
            }
          >
            <div className="grid h-20 place-items-center ">
              <RiLoader4Fill className="h-14 w-14 animate-spin text-orange-600" />
            </div>
          </CollapseHeightAnimation>
        </div>
      )}
    </div>
  );
};

export default EmailActionPage;
