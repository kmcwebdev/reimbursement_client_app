import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const PageTitle: React.FC = () => {
  const { pathname } = useRouter();

  if (pathname.includes("email-action")) {
    return (
      <div className="relative h-6 w-[101px]">
        <Image
          src="https://cdn.kmc.solutions/project-statics/KMC-logo-updated-black%20(1).png"
          alt="kmc-logo"
          sizes="100%"
          fill
        />
      </div>
    );
  }

  return (
    <h3 className="font-bold uppercase text-navy">
      {pathname.replaceAll("/", "").replaceAll("-", " ")}
    </h3>
  );
};

export default PageTitle;
