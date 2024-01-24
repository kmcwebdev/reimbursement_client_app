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

    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    //   ".docx",
    // ],
    // "application/msword": [".doc"],
  },
  // isUploading = false,
  // isUploaded = false,
  // uploadedFileUrl,
  handleUpload,
  setAttachedFiles,
  files,
  ...rest
}) => {
  // const dispatch = useDispatch();
  // const [file, setFile] = useState<FileWithPath | null>();

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
    accept,
    // disabled: !!(rest.maxFiles && files.length === rest.maxFiles),
    ...rest,
  });

  // const deleteFile = useCallback(
  //   () => {
  //     setFile(null);
  //     dispatch(setFileSelected(null));
  //     dispatch(setUploadedFileUrl(null));
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [file],
  // );

  /*
   const acceptedFileItem = useMemo(() => {
    if (file) {
      const isPDF = file.type === "application/pdf";
      const isImage = file.type === "image/*";
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
              {isImage && <BiSpreadsheet className="h-5 w-5 text-navy" />} 
              <MdFileCopy className="h-5 w-5 text-navy" />
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
 */

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

            <p className="text-neutral-600">PDF,Excel File or Image</p>
          </div>

          {/* <p className="flex items-center gap-2">
            <HiInformationCircle className="h-4 w-4 text-blue-600" />
            You can only upload 1 PDF or Word file.
          </p> */}
        </div>
      </CollapseHeightAnimation>

      {/* <CollapseHeightAnimation isVisible={!!acceptedFileItem}>
        <aside className="space-y-4 py-4">
          <p className="text-xs font-medium text-neutral-900">Uploaded Files</p>
          <ul className="mt-2 space-y-2">{acceptedFileItem}</ul>
        </aside>
      </CollapseHeightAnimation> */}

      {fileRejections.length > 0 && (
        <p className="mt-1 text-sm text-red-600">
          Selected file type is invalid! Only{" "}
          <span className="font-semibold">PDF ,Excel or Image</span> files are
          accepted.
        </p>
      )}
    </section>
  );
};

export default Upload;
