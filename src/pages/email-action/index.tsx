import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import EmptyState from "~/components/core/EmptyState";

interface indexProps {}

const index: React.FC<indexProps> = () => {
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
