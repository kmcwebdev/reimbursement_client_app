import React, { useCallback, type SetStateAction } from "react";
import {
  useDropzone,
  type DropzoneOptions,
  type FileWithPath,
} from "react-dropzone";
import { MdCloudUpload } from "react-icons-all-files/md/MdCloudUpload";
import { classNames } from "~/utils/classNames";
import CollapseHeightAnimation from "../animation/CollapseHeight";

export interface UploadProps extends DropzoneOptions {
  isUploading?: boolean;
  isUploaded?: boolean;
  uploadedFileUrl?: string;
  handleUpload: (file: File) => void;
  files: File[];
  setAttachedFiles: React.Dispatch<SetStateAction<File[]>>;
}

const Upload: React.FC<UploadProps> = ({
  onDrop,
  accept = {
    "application/pdf": [".pdf"],
    "image/*": [".png", ".jpg", ".jpeg"],
    "text/csv": [".csv"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
  handleUpload,
  setAttachedFiles,
  files,
  ...rest
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
  const handleDrop = useCallback(
    (e: FileWithPath) => {
      const filesCopy = [...files];
      filesCopy.push(e);
      setAttachedFiles(filesCopy);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleUpload],
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (e, i, f) => {
      if (i.length === 0) {
        onDrop && onDrop(e, i, f);
        handleDrop(e[0]);
      }
    },
    validator: fileValidator,
    accept,
    ...rest,
  });

  return (
    <section className="container p-0">
      <CollapseHeightAnimation isVisible={true}>
        <div className="flex flex-col gap-2">
          <div
            {...getRootProps({ className: "dropzone" })}
            className={classNames(
              "group flex cursor-pointer flex-col items-center gap-4 rounded border border-neutral-300 bg-white p-4 text-center outline-none transition-all hover:border-orange-700 focus:ring-1 focus:ring-orange-600",
              fileRejections.length > 0
                ? "border-red-600 focus:ring-red-600"
                : "border-neutral-300 focus:ring-orange-600",
            )}
          >
            <input {...getInputProps()} />

            <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-300">
              <MdCloudUpload className="h-6 w-6 text-neutral-800" />
            </div>

            <p className="font-bold text-orange-600">Click/Drop to Upload</p>

            <div className="flex flex-col gap-1">
              <p className="text-neutral-600">PDF,Excel File or Image</p>
              <p className="text-xs text-neutral-600">File size limit: 50MB </p>
            </div>
          </div>
        </div>
      </CollapseHeightAnimation>

      {fileRejections.length > 0 && (
        <p className="mt-1 text-sm text-red-600">
          {fileRejections[0].errors[0].code === "size-too-large" && (
            <>
              File size exceeds the maximum limit. Please reduce the file size
              and try again.
            </>
          )}
          {fileRejections[0].errors[0].code === "file-invalid-type" && (
            <>
              Selected file type is invalid! Only{" "}
              <span className="font-semibold">PDF ,Excel or Image</span> files
              are accepted.
            </>
          )}
        </p>
      )}
    </section>
  );
};

export default Upload;
