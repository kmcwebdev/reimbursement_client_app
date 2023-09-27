import {
  type GetStaticPaths,
  type GetStaticProps,
  type GetStaticPropsContext,
} from "next";
import Image from "next/image";
import React, { useState } from "react";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";

interface EmailActionProps {
  type: "approve" | "reject";
  token: string;
  noToken: boolean;
}

const EmailAction: React.FC<EmailActionProps> = ({ noToken, type, token }) => {
  const [loading, setLoading] = useState<boolean>(true);

  console.log(noToken, token);
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
          [Name] [R-ID] has been {type === "approve" ? "approved" : "rejected"}
        </p>
        <CollapseHeightAnimation isVisible={loading}>
          <div className="grid h-20 place-items-center ">
            <RiLoader4Fill className="h-14 w-14 animate-spin text-orange-600" />
          </div>
        </CollapseHeightAnimation>
      </div>
    </div>
  );
};

export default EmailAction;

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { ["type"]: "test", ["token"]: "test" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = (ctx: GetStaticPropsContext) => {
  const { params } = ctx;

  if (!params || !params.type || !params.token) {
    return {
      props: {
        noToken: true,
      },
    };
  }

  return {
    props: {
      noToken: false,
      type: params.type,
      token: params.token,
    },
  };
};
