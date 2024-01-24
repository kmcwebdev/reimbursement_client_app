import { type Metadata } from "next";
import React from "react";
import PageNotFound from "../components/PageNotFound";

export const metadata: Metadata = {
  title: "Page not found",
};

const NotFoundPage: React.FC = () => {
  return <PageNotFound />;
};

export default NotFoundPage;
