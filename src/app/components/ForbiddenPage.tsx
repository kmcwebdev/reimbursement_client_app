"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./core/Button";
import EmptyState from "./core/EmptyState";

const ForbiddenPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-72 w-full">
        <EmptyState
          title="Forbidden."
          description="You do not have permission to access this page."
        >
          <Button
            aria-label="Go back to Dashboard"
            onClick={() => router.push("/dashboard")}
          >
            Go back to Dashboard
          </Button>
        </EmptyState>
      </div>
    </div>
  );
};

export default ForbiddenPage;
