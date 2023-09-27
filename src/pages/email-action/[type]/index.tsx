import {
  type GetStaticPaths,
  type GetStaticProps,
  type GetStaticPropsContext,
} from "next";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import EmptyState from "~/components/core/EmptyState";
interface EmailActionTypeProps {
  invalidAction: boolean;
  tokenNotFound: boolean;
}

const index: React.FC<EmailActionTypeProps> = ({
  invalidAction,
  tokenNotFound,
}) => {
  return (
    <div className="grid-place-items-center grid h-full">
      {(invalidAction || tokenNotFound) && (
        <EmptyState
          icon={MdGavel as IconType}
          title="Invalid Url"
          description="Please check your redirect url."
        />
      )}
    </div>
  );
};

export default index;

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { ["type"]: "none" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = (ctx: GetStaticPropsContext) => {
  const { params } = ctx;

  if (
    !params ||
    !params.type ||
    (params.type !== "approve" && params.type !== "reject")
  ) {
    return {
      props: {
        invalidAction: true,
      },
    };
  }

  if (!params || !params.token) {
    return {
      props: {
        tokenNotFound: true,
      },
    };
  }

  return {
    redirect: {
      destination: `/email-action/${params.type}/${params.token as string}`,
      permanent: false,
    },
  };
};
