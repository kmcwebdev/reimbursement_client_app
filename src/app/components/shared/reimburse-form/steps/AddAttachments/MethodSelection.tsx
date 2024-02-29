import React, { useMemo, type RefObject } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { MdCameraAlt } from "react-icons-all-files/md/MdCameraAlt";
import { MdCloudUpload } from "react-icons-all-files/md/MdCloudUpload";
import { showToast } from "~/app/components/core/Toast";

interface MethodSelectionProps {
  buttonRef: RefObject<HTMLButtonElement>;
  toggleCamera: () => void;
  handleDrop: (e: File) => void;
  setFileRejections: React.Dispatch<React.SetStateAction<FileRejection[]>>;
}

const MethodSelection: React.FC<MethodSelectionProps> = ({
  toggleCamera,
  buttonRef,
  handleDrop,
  setFileRejections,
}) => {
  const fileValidator = (file: File) => {
    if (file.size > 50000000) {
      return {
        code: "size-too-large",
        message: `file is larger than 50MB`,
      };
    }

    return null;
  };

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onFileDialogOpen: () => {
      buttonRef.current?.click();
    },
    onDrop: (e, i) => {
      if (i.length === 0) {
        handleDrop(e[0]);
      }
    },
    validator: fileValidator,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 0) {
        setFileRejections(fileRejections);
        let title = "Invalid file type!";
        let message = "Please input a valid file type.";
        if (fileRejections[0].errors[0].code === "size-too-large") {
          title = "File size too large!";
          message = `File size exceeds the maximum limit. Please reduce the file size and try again.`;
        }
        showToast({
          type: "error",
          title,
          description: message,
        });
      }
    },
  });

  useMemo(() => {
    setFileRejections(fileRejections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileRejections]);

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
          {...getRootProps({
            className: "dropzone",
          })}
          className=" flex w-full gap-2"
        >
          <input {...getInputProps()} />
          <MdCloudUpload className="h-5 w-5" /> Upload File
        </div>
      </div>
    </div>
  );
};

export default MethodSelection;
