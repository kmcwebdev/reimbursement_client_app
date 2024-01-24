import { type Metadata } from "next";
import React from "react";
import ForbiddenPage from "../components/ForbiddenPage";

export const metadata: Metadata = {
  title: "Forbidden",
};

const Forbidden: React.FC = () => {
  return <ForbiddenPage />;
};

export default Forbidden;
