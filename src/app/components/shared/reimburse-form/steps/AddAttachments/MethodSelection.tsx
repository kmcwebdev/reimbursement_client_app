import React from "react";
import { type DropzoneState } from "react-dropzone";
import { MdCameraAlt } from "react-icons-all-files/md/MdCameraAlt";
import { MdCloudUpload } from "react-icons-all-files/md/MdCloudUpload";

interface MethodSelectionProps {
  dropZoneState: DropzoneState;
  toggleCamera: () => void;
}

const MethodSelection: React.FC<MethodSelectionProps> = ({
  dropZoneState,
  toggleCamera,
}) => {
  return (
    <div className="flex w-[12.5rem] flex-col p-4 font-medium">
      <div
        className="flex h-8 cursor-pointer items-center gap-2 text-neutral-900 transition-all ease-in-out hover:text-orange-600"
        onClick={toggleCamera}
      >
        <MdCameraAlt className="h-5 w-5" /> Take Photo
      </div>
      <div className="my-2 h-px bg-neutral-400"></div>
      <div className="flex h-8 cursor-pointer items-center gap-2 text-neutral-900 transition-all ease-in-out hover:text-orange-600">
        <div
          {...dropZoneState.getRootProps({
            className: "dropzone",
          })}
          className="flex w-full gap-2"
          onClick={dropZoneState.open}
        >
          <input {...dropZoneState.getInputProps()} />
          <MdCloudUpload className="h-5 w-5" /> Upload File
        </div>
      </div>
    </div>
  );
};

export default MethodSelection;
