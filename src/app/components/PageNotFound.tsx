"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./core/Button";
import EmptyState from "./core/EmptyState";

const PageNotFound: React.FC = () => {
  const router = useRouter();
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-72 w-full">
        <EmptyState
          title="Page Not Found."
          description="The page tou want to access doesn't exist."
        >
          <Button onClick={() => router.push("/dashboard")}>
            Go back to Dashboard
          </Button>
        </EmptyState>
      </div>
    </div>
  );
};

export default PageNotFound;
