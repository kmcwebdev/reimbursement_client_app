import React, { useCallback, useMemo, useState } from "react";
import {
  useDropzone,
  type DropzoneOptions,
  type FileWithPath,
} from "react-dropzone";
import { AiOutlineDelete } from "react-icons-all-files/ai/AiOutlineDelete";
import { BiSpreadsheet } from "react-icons-all-files/bi/BiSpreadsheet";
import { MdCloudUpload } from "react-icons-all-files/md/MdCloudUpload";
import { MdPictureAsPdf } from "react-icons-all-files/md/MdPictureAsPdf";
import { classNames } from "~/utils/classNames";
import CollapseHeightAnimation from "../animation/CollapseHeight";
import { Button, type ButtonProps } from "./Button";

export interface UploadProps extends DropzoneOptions {
  uploadButtonProps: Omit<ButtonProps, "onClick"> & {
    onClick: (e: FileWithPath[]) => void;
    buttontext?: string;
  };
}

const Upload: React.FC<UploadProps> = ({
  onDrop,
  accept = {
    "text/csv": [".csv"],
    "application/pdf": [".pdf"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xslx",
    ],
  },
  uploadButtonProps,
  ...rest
}) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [fileToEdit, setFileToEdit] = useState<FileWithPath | null>();

  const handleDrop = useCallback(
    (e: FileWithPath[]) => {
      if (rest.maxFiles && files.length === rest.maxFiles) {
        return;
      }

      if (fileToEdit) {
        const newFiles = [...files, ...e];
        newFiles.splice(newFiles.indexOf(fileToEdit), 1);
        setFiles(newFiles);

        setFileToEdit(null);
        return;
      }

      setFiles((old) => [...old, ...e]);
    },
    [fileToEdit, files, rest.maxFiles],
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (e, i, f) => {
      onDrop && onDrop(e, i, f);
      handleDrop(e);
    },
    accept,
    disabled: !!(rest.maxFiles && files.length === rest.maxFiles),
    ...rest,
  });

  const deleteFile = useCallback(
    (e: FileWithPath) => {
      const newFiles = [...files];
      newFiles.splice(newFiles.indexOf(e), 1);
      setFiles(newFiles);
    },
    [files],
  );

  const acceptedFileItems = useMemo(
    () =>
      files.map((file: FileWithPath, idx) => {
        const isPDF = file.type === "application/pdf";

        const isSpreadsheet =
          file.type === "text/csv" ||
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        return (
          <li
            className="flex justify-between gap-4 rounded bg-gray-100 py-2"
            key={file.path + `${idx}`}
          >
            <div className="flex gap-2">
              <span className="border-gray-3 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm border">
                {isPDF && (
                  <MdPictureAsPdf className="h-6 w-6 text-neutral-subtle" />
                )}
                {isSpreadsheet && (
                  <BiSpreadsheet className="h-6 w-6 text-neutral-subtle" />
                )}
              </span>

              <span className="flex w-52 flex-col justify-between">
                <span className="typography-label text-gray-500">
                  File name
                </span>
                <span className="typography-caption truncate font-medium text-neutral-pressed">
                  {file.name}
                </span>
              </span>
            </div>

            <div className="flex items-center">
              <button
                disabled={uploadButtonProps?.loading}
                type="button"
                onClick={() => deleteFile(file)}
                className="rounded p-2 text-red-400 outline-none hover:text-red-600 focus:ring-1 focus:ring-red-300 focus:ring-offset-2"
              >
                <AiOutlineDelete />
              </button>
            </div>
          </li>
        );
      }),
    [files, deleteFile, uploadButtonProps?.loading],
  );

  return (
    <section className="container p-0">
      <div
        {...getRootProps({ className: "dropzone" })}
        className={classNames(
          "group flex cursor-pointer flex-col items-center gap-4 rounded border border-neutral-subtle bg-white p-4 text-center outline-none transition-all hover:border-primary-hover focus:ring-1 focus:ring-primary-default",
          fileRejections.length > 0
            ? "border-red-600 focus:ring-red-400"
            : "border-neutral-subtle focus:ring-primary-default",
        )}
      >
        <input {...getInputProps()} />

        <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-200">
          <MdCloudUpload className="h-6 w-6 text-neutral-pressed" />
        </div>

        <p className="font-bold text-primary-default">Click/Drop to Upload</p>

        <p className="text-gray-800">
          PDF or Excel (add the images of particulars)
        </p>
      </div>

      <CollapseHeightAnimation isVisible={acceptedFileItems.length > 0}>
        <aside className="py-2">
          <p className="text-xs font-medium text-neutral-default">
            Selected Files
          </p>
          <ul className="space-y-2">{acceptedFileItems}</ul>
        </aside>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            className="px-5"
            {...{
              ...uploadButtonProps,
              onClick: () => {
                uploadButtonProps.onClick(files);
              },
            }}
          >
            {uploadButtonProps.buttontext
              ? uploadButtonProps.buttontext
              : "Upload File"}
          </Button>
        </div>
      </CollapseHeightAnimation>
    </section>
  );
};

export default Upload;
