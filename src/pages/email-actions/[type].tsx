import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React from "react";

interface EmailActionProps {
  type?: "approve" | "reject";
  error?: boolean;
}

const EmailAction: React.FC<EmailActionProps> = ({ error, type }) => {
  if (error) {
    return <>Error</>;
  }

  return <>{type}</>;
};

export default EmailAction;

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { ["type"]: "test", id: "null" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = (ctx: GetStaticPropsContext) => {
  const { params } = ctx;

  console.log(params);

  if (!params) {
    return {
      props: { error: true },
    };
  }

  if (params && !params.type) {
    return {
      props: { error: true },
    };
  }

  if (params && params.type !== "approve" && params.type !== "reject") {
    return {
      props: { error: true },
    };
  }

  return {
    props: {
      type: params.type,
    },
  };
};
