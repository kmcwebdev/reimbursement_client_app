import React from "react";
import { MdCameraAlt } from "react-icons-all-files/md/MdCameraAlt";
import { MdCloudUpload } from "react-icons-all-files/md/MdCloudUpload";
import { Button } from "~/app/components/core/Button";
import { useAppDispatch } from "~/app/hook";
import { setActiveParticularStep } from "~/features/reimbursement-form-slice";

const SelectAttachmentMethod: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleReturn = () => {
    dispatch(setActiveParticularStep("details"));
  };
  return (
    <div className="flex flex-col gap-2 py-4">
      <div
        className="group grid h-44 cursor-pointer  place-items-center gap-2 rounded border border-neutral-300 px-4 py-[0.6rem] transition-all ease-in-out hover:border-orange-600"
        onClick={() => dispatch(setActiveParticularStep("capture"))}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-300">
            <MdCameraAlt className="h-6 w-6 text-neutral-600 transition-all ease-in-out group-hover:text-orange-600" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="font-bold text-orange-600">Take Photo</p>
            <p className="text-neutral-600">
              Take photo of all the included particular/s
            </p>
          </div>
        </div>
      </div>
      <p className="text-center font-bold text-neutral-600">Or</p>
      <div
        className="group grid h-44 cursor-pointer  place-items-center gap-2 rounded border border-neutral-300 px-4 py-[0.6rem] transition-all ease-in-out hover:border-orange-600"
        onClick={() => dispatch(setActiveParticularStep("upload"))}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-300">
            <MdCloudUpload className="h-6 w-6 text-neutral-600 transition-all ease-in-out group-hover:text-orange-600" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="font-bold text-orange-600">Upload File</p>
            <p className="text-neutral-600">
              PDF (Compiled particulars) and Images
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 pt-4">
        <Button
          buttonType="outlined"
          variant="neutral"
          className="w-full"
          onClick={handleReturn}
        >
          Return
        </Button>
      </div>
    </div>
  );
};

export default SelectAttachmentMethod;
