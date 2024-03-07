import { type Metadata } from "next";
import React from "react";
import ServerError from "../components/ServerErrorPage";

export const metadata: Metadata = {
  title: "Page not found",
};

const ServerErrorPage: React.FC = () => {
  return <ServerError />;
};

export default ServerErrorPage;
