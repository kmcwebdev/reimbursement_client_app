import Image from "next/image";
import React from "react";

const PageTitle: React.FC = () => {
  if (window.location.pathname.includes("email-action")) {
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

  if (window.location.pathname.includes("forbidden")) {
    return <h3 className="font-bold uppercase text-navy">Forbidden</h3>;
  }

  if (window.location.pathname.includes("not-found")) {
    return <h3 className="font-bold uppercase text-navy">Page not Found</h3>;
  }

  return (
    <h3 className="font-bold uppercase text-navy">
      {window.location.pathname.replaceAll("/", "").replaceAll("-", " ")}
    </h3>
  );
};

export default PageTitle;
