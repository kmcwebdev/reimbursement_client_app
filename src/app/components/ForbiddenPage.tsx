"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAppSelector } from "../hook";
import { Button } from "./core/Button";
import EmptyState from "./core/EmptyState";

const ForbiddenPage: React.FC = () => {
  const router = useRouter();
  const { user, assignedRole } = useAppSelector((state) => state.session);

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-72 w-full">
        <EmptyState
          title="Forbidden."
          description="You do not have permission to access this page."
        >
          {assignedRole ? (
            <Button
              aria-label="Go back to Dashboard"
              onClick={() => router.push("/dashboard")}
            >
              Go back to Dashboard
            </Button>
          ) : (
            <>
              {user?.is_superuser ? (
                <Button
                  aria-label="Go to Admin Dashboard"
                  onClick={() => router.push("/admin")}
                >
                  Go to Admin Dashboard
                </Button>
              ) : (
                <Button
                  aria-label="View Profile"
                  onClick={() => router.push("/profile")}
                >
                  View Profile
                </Button>
              )}
            </>
          )}
        </EmptyState>
      </div>
    </div>
  );
};

export default ForbiddenPage;
