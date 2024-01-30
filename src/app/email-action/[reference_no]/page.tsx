"use client";

import { useParams } from "next/navigation";
import { type IconType } from "react-icons-all-files";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import EmptyState from "~/app/components/core/EmptyState";

const EmailActionPage = () => {
  const params = useParams();

  console.log("Par", params);

  return (
    <div className="grid-place-items-center grid h-full">
      {(params &&
        params.action_type !== "approve" &&
        params.action_type !== "reject") ||
        (!params?.token && (
          <EmptyState
            icon={MdGavel as IconType}
            title="Invalid Url"
            description="Please check your redirect url."
          />
        ))}
    </div>
  );
};

export default EmailActionPage;
