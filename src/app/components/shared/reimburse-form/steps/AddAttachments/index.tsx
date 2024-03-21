import React, { useEffect, useRef, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { type UseFormReturn } from "react-hook-form";
import { HiOutlinePlus } from "react-icons-all-files/hi/HiOutlinePlus";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import Popover from "~/app/components/core/Popover";
import { showToast } from "~/app/components/core/Toast";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  useCreateReimbursementMutation,
  useUploadFileMutation,
} from "~/features/api/reimbursement-form-api-slice";
import {
  _setTempAttachedFiles,
  clearReimbursementForm,
  setActiveStep,
  setReimbursementFormValues,
  toggleFormDialog,
} from "~/features/state/reimbursement-form-slice";
import {
  type ParticularDetails,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { isDuplicateFile } from "~/utils/is-duplicate-file";
import AttachmentsList from "./AttachmentsList";
import Camera from "./Camera";
import MethodSelection from "./MethodSelection";

interface AttachmentProps {
  formReturn: UseFormReturn<ParticularDetails>;
  handleResetRequestType: () => void;
}

export interface AttachedFile {
  status: "uploading" | "uploaded" | "unprocessed";
  file: File;
}

const AddAttachments: React.FC<AttachmentProps> = ({
  handleResetRequestType,
  formReturn,
}) => {
  const { activeStep, reimbursementFormValues, _temp_attachedFiles } =
    useAppSelector((state) => state.reimbursementForm);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [processed, setProcessed] = useState<number>(0);
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);

  const dispatch = useAppDispatch();

  const [uploadFiles] = useUploadFileMutation();

  const handleUpload = (file: File) => {
    const formData = new FormData();
    formData.append("file_upload", file);

    void uploadFiles(formData)
      .unwrap()
      .then((data) => {
        if (data) {
          const updatedAttachedFiles = attachedFiles.map((a) => {
            let updated = a;
            if (a.file.name === data.file_name) {
              updated = {
                ...a,
                status: "uploaded",
              };
            }
            return updated;
          });

          setProcessed(processed + 1);
          setAttachedFiles(updatedAttachedFiles);
          dispatch(_setTempAttachedFiles(updatedAttachedFiles));
          dispatch(
            setReimbursementFormValues({
              ...reimbursementFormValues,
              attachments: [...reimbursementFormValues.attachments, data],
            }),
          );

          if (processed === attachedFiles.length - 1) {
            showToast({
              type: "success",
              description: "File Upload Success!",
            });
          }
        }
      })
      .catch((error: RtkApiError) => {
        showToast({
          type: "error",
          description: error.data.detail,
        });
      });
  };

  //Automatically upload if attachment name is not in uploadedAttachmentNames
  useEffect(() => {
    if (
      attachedFiles &&
      attachedFiles.length > 0 &&
      processed !== attachedFiles.length
    ) {
      const unUploadedAttachedFiles = attachedFiles.filter(
        (a) => a.status === "unprocessed",
      );

      if (unUploadedAttachedFiles.length > 0) {
        handleUpload(unUploadedAttachedFiles[0].file);
        const updatedAttachedFiles = attachedFiles.map((a) => {
          let updated = a;
          if (a.file.name === unUploadedAttachedFiles[0].file.name) {
            updated = {
              ...a,
              status: "uploading",
            };
          }
          return updated;
        });

        setAttachedFiles(updatedAttachedFiles);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachedFiles.length, processed]);

  useEffect(() => {
    if (_temp_attachedFiles.length > 0) {
      setAttachedFiles(_temp_attachedFiles);
    }
  }, [_temp_attachedFiles]);

  const handleDropMultiple = (files: File[]) => {
    const updatedAttachedFiles = [...attachedFiles];

    files.forEach((file) => {
      const formattedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      updatedAttachedFiles.push({ status: "unprocessed", file: formattedFile });
      setAttachedFiles(updatedAttachedFiles);
    });
  };

  const onCaptureProceed = (attachment: File) => {
    setShowCamera(false);
    handleDropMultiple([attachment]);
  };
  const [createReimbursement, { isLoading: isSubmitting }] =
    useCreateReimbursementMutation();

  const handleContinue = () => {
    if (reimbursementFormValues.request_type === 1) {
      const payload = {
        ...reimbursementFormValues,
      };

      delete payload["manager_approver_email"];

      void createReimbursement(payload)
        .unwrap()
        .then(() => {
          dispatch(toggleFormDialog());
          dispatch(clearReimbursementForm());
          dispatch(_setTempAttachedFiles([]));
          setAttachedFiles([]);
          handleResetRequestType();
          formReturn.reset();
          showToast({
            type: "success",
            description:
              "Your reimbursement request has been submitted successfully!",
          });
        })
        .catch((error: RtkApiError) => {
          if (error) {
            showToast({
              type: "error",
              description: error.data.detail,
            });
          }
        });
    } else {
      dispatch(setActiveStep(activeStep + 1));
    }
  };

  useEffect(() => {
    if (fileRejections.length > 0) {
      setFileRejections([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCamera]);

  const fileValidator = (attachedFiles: AttachedFile[], file: File) => {
    if (file.size > 50000000) {
      return {
        code: "size-too-large",
        message: `file is larger than 50MB`,
      };
    }

    if (file.name.length > 100) {
      return {
        code: "name-too-long",
        message: `file name exceeds 100 characters`,
      };
    }

    if (isDuplicateFile(attachedFiles, file)) {
      return {
        code: "duplicate-file",
        message: `file already exists`,
      };
    }

    return null;
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onFileDialogOpen: () => {
      buttonRef.current?.click();
      setFileRejections([]);
    },
    noClick: true,
    onDrop: (e, i) => {
      if (i.length === 0) {
        handleDropMultiple(e);
      }
    },
    validator: (e) => fileValidator(attachedFiles, e),
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
      setFileRejections([]);
      if (fileRejections.length > 0) {
        setFileRejections(fileRejections);
        let title = "Invalid file type!";
        let message = "Please input a valid file type.";
        if (fileRejections[0].errors[0].code === "size-too-large") {
          title = "File size too large!";
          message = `File size exceeds the maximum limit. Please reduce the file size and try again.`;
        }

        if (fileRejections[0].errors[0].code === "name-too-long") {
          title = "File name too long!";
          message = `File name exceeds 100 characters. Please rename the file and try again.`;
        }

        if (fileRejections[0].errors[0].code === "duplicate-file") {
          title = "Duplicate File!";
          message = `File already exists.`;
        }

        showToast({
          type: "error",
          title,
          description: message,
        });
      }
    },
  });

  const onDelete = (name: string) => {
    const filtered = attachedFiles.filter((a) => a.file.name !== name);

    setAttachedFiles(filtered);
    setProcessed(processed - 1);

    const updated = reimbursementFormValues.attachments.filter(
      (a) => a.file_name !== name,
    );

    dispatch(_setTempAttachedFiles(filtered));
    dispatch(
      setReimbursementFormValues({
        ...reimbursementFormValues,
        attachments: updated,
      }),
    );
  };

  return (
    <div>
      <div
        {...getRootProps({
          className: "dropzone",
        })}
      >
        <input {...getInputProps()} />
      </div>

      <div className="flex text-xs text-neutral-700">
        <p>Upload PDF,Excel File or JPEG, maximum upload file size (50mb).</p>
      </div>
      <div className="mt-2 h-px bg-neutral-300" />

      <CollapseHeightAnimation isVisible={showCamera}>
        <Camera
          onProceed={onCaptureProceed}
          toggleCamera={() => {
            setShowCamera(!showCamera);
            setFileRejections([]);
          }}
        />
      </CollapseHeightAnimation>

      {!showCamera && (
        <>
          <AttachmentsList
            uploadedAttachments={attachedFiles}
            onDelete={onDelete}
          />

          <CollapseHeightAnimation
            isVisible={fileRejections && fileRejections.length > 0}
            className="mt-2"
          >
            {fileRejections && fileRejections.length > 0 && (
              <p className="mt-1 text-xs text-red-600">
                {fileRejections[0].errors[0].code === "file-invalid-type" &&
                  "Please provide a file with an accepted file type. The one you selected is not valid."}

                {fileRejections[0].errors[0].code === "size-too-large" &&
                  "The file you chose is too large. Please shrink its size and try uploading again."}

                {fileRejections[0].errors[0].code === "name-too-long" &&
                  "File name exceeds 100 characters. Please rename the file and try again."}

                {fileRejections[0].errors[0].code === "duplicate-file" &&
                  "File already exists.Please upload other file and try again."}
              </p>
            )}
          </CollapseHeightAnimation>

          <div className="flex flex-col pt-4">
            <div className="w-3/4">
              <Popover
                ariaLabel="Upload File or Take Photo"
                buttonRef={buttonRef}
                btn={
                  <div className="group flex w-full items-center gap-2 text-xs font-medium hover:text-orange-600">
                    <HiOutlinePlus className="h-5 w-5 text-orange-600" /> Upload
                    File or Take Photo
                  </div>
                }
                content={
                  <MethodSelection
                    openFileDialog={open}
                    toggleCamera={() => setShowCamera(!showCamera)}
                  />
                }
              />
            </div>
          </div>
        </>
      )}

      {!showCamera && (
        <div className="grid grid-cols-2 items-center gap-2 pt-4">
          <span></span>

          <div
            className={classNames(
              reimbursementFormValues.attachments.length > 0 &&
                !isSubmitting &&
                "grid grid-cols-2",
              "gap-4",
            )}
          >
            {!isSubmitting && (
              <Button
                aria-label="Return"
                type="button"
                buttonType="outlined"
                variant="neutral"
                className="w-full"
                onClick={() => {
                  setFileRejections([]);
                  dispatch(setActiveStep(activeStep - 1));
                }}
              >
                Return
              </Button>
            )}

            {reimbursementFormValues.attachments.length > 0 && (
              <Button
                aria-label="Continue"
                type="button"
                className="w-full"
                onClick={handleContinue}
                loading={isSubmitting}
                disabled={
                  reimbursementFormValues.attachments.length === 0 ||
                  attachedFiles.filter(
                    (a) =>
                      a.status === "unprocessed" || a.status === "uploading",
                  ).length > 0 ||
                  isSubmitting
                }
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      )}

      {/* <Dialog
        title="Confirm Return?"
        isVisible={confirmReturnDialogOpen}
        close={closeConfirmReturnDialog}
      >
        <div className="flex flex-col gap-8 pt-8">
          <p className="text-neutral-800">
            Returning to the previous step will clear all your uploaded files.
            Are you sure you want to return?
          </p>

          <div className="flex items-center gap-4">
            <Button
              aria-label="No"
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={closeConfirmReturnDialog}
            >
              No
            </Button>
            <Button
              aria-label="Yes"
              variant="danger"
              className="w-1/2"
              onClick={() => {
                setAttachedFiles([]);
                setProcessed(0);
                setFileRejections([]);
                dispatch(setActiveStep(activeStep - 1));
                dispatch(
                  setReimbursementFormValues({
                    ...reimbursementFormValues,
                    attachments: [],
                  }),
                );
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Dialog> */}
    </div>
  );
};

export default AddAttachments;
