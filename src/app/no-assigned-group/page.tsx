import { type Metadata } from "next";
import React from "react";
import NoGroupAssignedPage from "../components/NoGroupAssignedPage";

export const metadata: Metadata = {
  title: "Access Restricted",
};

const NoGroupAssigned: React.FC = () => {
  return <NoGroupAssignedPage />;
};

export default NoGroupAssigned;
