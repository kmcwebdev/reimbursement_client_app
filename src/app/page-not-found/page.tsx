import { type Metadata } from "next";
import React from "react";
import EmptyState from "~/app/components/core/EmptyState";

export const metadata: Metadata = {
  title: "Page not found",
};

const NotFoundPage: React.FC = () => {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-72 w-full">
        <EmptyState
          title="Page Not Found."
          description={`The page doesn't exist.`}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
