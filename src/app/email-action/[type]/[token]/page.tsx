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

interface EmailActionProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const EmailAction: React.FC<EmailActionProps> = ({ searchParams }) => {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  // const { type, token } = useParams() as {
  //   token: string;
  //   type: "approve" | "reject";
  // };
  const [approveRequestIsLoading, setApproveRequestIsLoading] = useState(false);
  const [rejectRequestIsLoading, setRejectRequestIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isApprovalError, setIsApprovalError] = useState(false);
  const requestId = Array.isArray(searchParams.request_id)
    ? searchParams.request_id[0]
    : searchParams.request_id;
  const action_id = Array.isArray(searchParams.action_id)
    ? searchParams.action_id[0]
    : searchParams.action_id;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  useEffect(() => {
    if (!isApproved) {
      setApproveRequestIsLoading(true);
      setRejectRequestIsLoading(true);
      const fetchData = async () => {
        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_BASEAPI_URL +
              `/reimbursements/request/${requestId}/${token}?via_email_link=true&action_id=${action_id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${String(searchParams.access_token)}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = response.json();
          console.log("Data fetched successfully:", data);
          setIsApproved(true);
          // Handle the fetched data
        } catch (error) {
          setIsApprovalError(true);
          console.error("Fetching data failed:", error);
        }
      };
      fetchData().catch((error) => {
        console.error("Error in fetchData:", error);
      });

      setApproveRequestIsLoading(false);
      setRejectRequestIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved]);

  return (
    <div className="grid h-full place-items-center">
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
          isVisible={!approveRequestIsLoading || !rejectRequestIsLoading}
        >
          {!isApprovalError ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {params.token === "reject" && (
                  <>
                    <MdClose className="h-5 w-5 text-red-600" />
                    Reject
                  </>
                )}

                {params.token === "approve" && (
                  <>
                    <HiCheckCircle className="h-5 w-5 text-green-600" />
                    Approved
                  </>
                )}
              </div>
              <p className="text-neutral-600">
                {typeof params.type === "string"
                  ? params.type.toUpperCase()
                  : ""}{" "}
                has been {params.token === "approve" ? "approved" : "rejected"}
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
