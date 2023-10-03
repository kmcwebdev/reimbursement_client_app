import Head from "next/head";
import React from "react";
import EmptyState from "~/components/core/EmptyState";

const ForbiddenPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Forbidden</title>
      </Head>
      <div className="grid h-full w-full place-items-center">
        <div className="h-72 w-full">
          <EmptyState
            title="Forbidden."
            description="You do not have permission to access this page."
          />
        </div>
      </div>
    </>
  );
};

export default ForbiddenPage;
