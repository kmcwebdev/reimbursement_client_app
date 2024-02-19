"use client";
import React from "react";
import EmptyState from "./core/EmptyState";

const NoGroupAssignedPage: React.FC = () => {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-72 w-full">
        <EmptyState
          title="Access Restricted."
          description="Access to the app is restricted as you are not an admin or haven't been assigned to any group. Please contact your account manager."
        ></EmptyState>
      </div>
    </div>
  );
};

export default NoGroupAssignedPage;
