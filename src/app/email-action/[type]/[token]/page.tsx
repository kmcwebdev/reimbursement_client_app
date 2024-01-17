/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { HiExclamationCircle } from "react-icons-all-files/hi/HiExclamationCircle";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import {
  useApproveReimbursementViaEmailMutation,
  useRejectReimbursementViaEmailMutation,
} from "~/features/api/actions-api-slice";

interface EmailActionProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const EmailAction: React.FC<EmailActionProps> = ({ searchParams }) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const { type, token } = useParams() as {
    token: string;
    type: "approve" | "reject";
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [
    approveRequest,
    {
      isLoading: approveRequestIsLoading,
      isUninitialized: approvalUninitialized,
      isError: isApprovalError,
    },
  ] = useApproveReimbursementViaEmailMutation();

  const [
    rejectRequest,
    {
      isLoading: rejectRequestIsLoading,
      isUninitialized: rejectUninitialized,
      isError: isRejectError,
    },
  ] = useRejectReimbursementViaEmailMutation();

  useEffect(() => {
    if (token && type) {
      if (type === "approve") {
        void approveRequest(token);
      }

      if (type === "reject") {
        void rejectRequest(token);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, type]);

  return (
    <div
      className="grid h-full place-items-center"
      onClick={() => setLoading(!loading)}
    >
      <div className="flex w-1/4 flex-col gap-4 rounded-md border bg-white p-4 shadow-md">
        <div className="relative h-6 w-[101px]">
          <Image
            src="https://cdn.kmc.solutions/project-statics/KMC-logo-updated-black%20(1).png"
            alt="kmc-logo"
            sizes="100%"
            fill
          />
        </div>

        <CollapseHeightAnimation
          isVisible={
            (!approveRequestIsLoading && !approvalUninitialized) ||
            (!rejectRequestIsLoading && !rejectUninitialized)
          }
        >
          {!isApprovalError && !isRejectError ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {type === "reject" && (
                  <>
                    <MdClose className="h-5 w-5 text-red-600" />
                    Reject
                  </>
                )}

                {type === "approve" && (
                  <>
                    <HiCheckCircle className="h-5 w-5 text-green-600" />
                    Approved
                  </>
                )}
              </div>
              <p className="text-neutral-600">
                {searchParams.requestor} {searchParams.rid} has been{" "}
                {type === "approve" ? "approved" : "rejected"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <HiExclamationCircle className="h-5 w-5 text-red-600" />
                Something went wrong!
              </div>
              <p className="text-neutral-600">
                Approval link not found or has expired.
              </p>
            </div>
          )}
        </CollapseHeightAnimation>

        <CollapseHeightAnimation
          isVisible={approveRequestIsLoading || rejectRequestIsLoading}
        >
          <div className="grid h-20 place-items-center ">
            <RiLoader4Fill className="h-14 w-14 animate-spin text-orange-600" />
          </div>
        </CollapseHeightAnimation>
      </div>
    </div>
  );
};

export default EmailAction;
