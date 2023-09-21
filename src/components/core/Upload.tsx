import React, { useCallback, useMemo, useState } from "react";
import {
  useDropzone,
  type DropzoneOptions,
  type FileWithPath,
} from "react-dropzone";
import { BiSpreadsheet } from "react-icons-all-files/bi/BiSpreadsheet";
import { BsFiletypeDoc } from "react-icons-all-files/bs/BsFiletypeDoc";
import { HiInformationCircle } from "react-icons-all-files/hi/HiInformationCircle";
import { MdCloudUpload } from "react-icons-all-files/md/MdCloudUpload";
import { MdOutlineDelete } from "react-icons-all-files/md/MdOutlineDelete";
import { MdPictureAsPdf } from "react-icons-all-files/md/MdPictureAsPdf";
import { useDispatch } from "react-redux";
import {
  setFileSelected,
  setUploadedFileUrl,
} from "~/features/reimbursement-form-slice";
import { classNames } from "~/utils/classNames";
import CollapseHeightAnimation from "../animation/CollapseHeight";
import IndeterminateProgressBar from "../loaders/IndeterminateProgressBar";
import { Button } from "./Button";

export interface UploadProps extends DropzoneOptions {
  isUploading?: boolean;
  isUploaded?: boolean;
  uploadedFileUrl?: string;
  fileSelected: FileWithPath | null;
}

const Upload: React.FC<UploadProps> = ({
  onDrop,
  accept = {
    // "text/csv": [".csv"],
    "application/pdf": [".pdf"],
    // "application/vnd.ms-excel": [".xls"],
    // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    //   ".xslx",
    // ],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/msword": [".doc"],
  },
  isUploading = false,
  isUploaded = false,
  uploadedFileUrl,
  fileSelected,
  ...rest
}) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<FileWithPath | null>();

  const handleDrop = useCallback(
    (e: FileWithPath) => {
      setFile(e);
      dispatch(setFileSelected(e));
    },
    [dispatch],
  );

  useMemo(() => {
    if (fileSelected) {
      setFile(fileSelected);
    }
  }, [fileSelected]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (e, i, f) => {
      onDrop && onDrop(e, i, f);
      handleDrop(e[0]);
    },
    accept,
    // disabled: !!(rest.maxFiles && files.length === rest.maxFiles),
    ...rest,
  });

  const deleteFile = useCallback(
    () => {
      setFile(null);
      dispatch(setFileSelected(null));
      dispatch(setUploadedFileUrl(null));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [file],
  );

  const acceptedFileItem = useMemo(() => {
    if (file) {
      const isPDF = file.type === "application/pdf";
      const isWord =
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isSpreadsheet =
        file.type === "text/csv" ||
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      return (
        <li
          className={classNames(
            isUploading || uploadedFileUrl
              ? "justify-normal"
              : "justify-between",
            "flex gap-4 rounded border border-neutral-300 p-2",
          )}
        >
          <div className="flex flex-1 items-center gap-2 truncate">
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-neutral-300">
              {isPDF && <MdPictureAsPdf className="h-5 w-5 text-navy" />}
              {isSpreadsheet && <BiSpreadsheet className="h-5 w-5 text-navy" />}
              {isWord && <BsFiletypeDoc className="h-5 w-5 text-navy" />}
            </span>

            <span
              className={classNames(
                isUploading || uploadedFileUrl ? "w-full" : "w-52",
                "relative flex w-full flex-col justify-center gap-2",
              )}
            >
              <span className="truncate">{file.name}</span>

              {isUploading && <IndeterminateProgressBar />}

              {isUploaded && uploadedFileUrl && (
                <span className="truncate text-xs text-neutral-600">
                  {uploadedFileUrl}
                </span>
              )}
            </span>
          </div>
          {!isUploading && !uploadedFileUrl && (
            <div className="flex items-center gap-2 pr-2">
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <Button type="button" buttonType="text">
                  Replace
                </Button>
              </div>

              <Button
                type="button"
                buttonType="text"
                variant="danger"
                onClick={deleteFile}
              >
                <MdOutlineDelete className="h-5 w-5" />
              </Button>
            </div>
          )}
        </li>
      );
    }
  }, [
    file,
    isUploading,
    isUploaded,
    uploadedFileUrl,
    getRootProps,
    getInputProps,
    deleteFile,
  ]);

  return (
    <section className="container p-0">
      <CollapseHeightAnimation isVisible={!file}>
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

            <p className="text-neutral-600">
              PDF,Word or Excel (add the images of particulars)
            </p>
          </div>

          <p className="flex items-center gap-2">
            <HiInformationCircle className="h-4 w-4 text-blue-600" />
            You can only upload 1 PDF or Word file.
          </p>
        </div>
      </CollapseHeightAnimation>

      <CollapseHeightAnimation isVisible={!!acceptedFileItem}>
        <aside className="space-y-4 py-4">
          <p className="text-xs font-medium text-neutral-900">Uploaded Files</p>
          <ul className="mt-2 space-y-2">{acceptedFileItem}</ul>
        </aside>
      </CollapseHeightAnimation>

      {fileRejections.length > 0 && (
        <p className="mt-1 text-sm text-red-600">
          Selected file type is invalid! Only{" "}
          <span className="font-semibold">.pdf,.doc,.docx</span> files are
          accepted.
        </p>
      )}
    </section>
  );
};

export default Upload;
