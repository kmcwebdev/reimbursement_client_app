import { type Metadata } from "next";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import EmptyState from "~/app/components/core/EmptyState";

export const metadata: Metadata = {
  title: "Email Action",
};

const index: React.FC = () => {
  return (
    <div className="grid-place-items-center grid h-full">
      <EmptyState
        icon={MdGavel as IconType}
        title="Invalid Url"
        description="Please check your redirect url."
      />
    </div>
  );
};

export default index;
