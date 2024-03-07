"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./core/Button";
import EmptyState from "./core/EmptyState";

const ServerError: React.FC = () => {
  const router = useRouter();
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-72 w-full">
        <EmptyState
          title="Internal Server Error."
          description="The server encountered an unexpected condition that prevented it from fulfilling the request."
        >
          <Button aria-label="Reload" onClick={() => router.push("/dashboard")}>
            Go back to Dashboard
          </Button>
        </EmptyState>
      </div>
    </div>
  );
};

export default ServerError;
