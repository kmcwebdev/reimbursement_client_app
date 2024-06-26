import React from "react";
import { BsFingerprint } from "react-icons-all-files/bs/BsFingerprint";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";

const AuthLoader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="grid h-screen w-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-24 w-24">
          <div className="absolute grid h-full w-full place-items-center">
            <BsFingerprint className="absolute h-10 w-10" />
          </div>
          <RiLoader4Fill className="h-24 w-24 animate-spin text-orange-600" />
        </div>

        <h5>{message ? message : "Authenticating, please wait..."}</h5>
      </div>
    </div>
  );
};

export default AuthLoader;
