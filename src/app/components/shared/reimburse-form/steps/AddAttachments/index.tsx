import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  useDropzone,
  type FileRejection,
  type FileWithPath,
} from "react-dropzone";
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
  clearReimbursementForm,
  setActiveStep,
  setReimbursementFormValues,
  toggleFormDialog,
} from "~/features/state/reimbursement-form-slice";
import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";
import { type MutationError } from "~/types/global-types";
import { classNames } from "~/utils/classNames";
import AttachmentsList from "./AttachmentsList";
import Camera from "./Camera";
import MethodSelection from "./MethodSelection";

interface AttachmentProps {
  formReturn: UseFormReturn<ParticularDetails>;
  handleResetRequestType: () => void;
}

const AddAttachments: React.FC<AttachmentProps> = ({
  handleResetRequestType,
  formReturn,
}) => {
  const { activeStep, reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<
    { name: string; status: "uploading" | "uploaded"; type: string }[]
  >([]);

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
          const attachmentsCopy = [...reimbursementFormValues.attachments];
          const statusIsUploadingIndex = uploadedAttachments.findIndex(
            (a) => a.status === "uploading",
          );

          if (statusIsUploadingIndex !== null) {
            const uploadedAttachmentsCopy = uploadedAttachments;
            uploadedAttachmentsCopy[statusIsUploadingIndex].status = "uploaded";
            setUploadedAttachments(uploadedAttachmentsCopy);
          }

          attachmentsCopy.push(data);

          dispatch(
            setReimbursementFormValues({
              ...reimbursementFormValues,
              attachments: attachmentsCopy,
            }),
          );
        }
      })
      .catch(() => {
        showToast({
          type: "error",
          description:
            "There was a problem uploading attachments. Please try again!",
        });
      });
  };

  //Automatically upload if attachment name is not in uploadedAttachmentNames
  useMemo(() => {
    if (attachedFiles.length > 0) {
      const isAlreadyUploaded = uploadedAttachments.find(
        (a) => a.name === attachedFiles[attachedFiles.length - 1].name,
      );

      if (!isAlreadyUploaded) {
        const uploadedAttachmentsCopy = uploadedAttachments;

        uploadedAttachmentsCopy.push({
          name: attachedFiles[attachedFiles.length - 1].name,
          status: "uploading",
          type: attachedFiles[attachedFiles.length - 1].type,
        });
        setUploadedAttachments(uploadedAttachmentsCopy);
        handleUpload(attachedFiles[attachedFiles.length - 1]);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachedFiles]);

  const onCaptureProceed = (attachment: File) => {
    setShowCamera(false);
    handleDrop(attachment);
  };

  useMemo(() => {
    if (reimbursementFormValues.attachments.length > 0) {
      reimbursementFormValues.attachments.forEach((file) => {
        const isAlreadyUploaded = uploadedAttachments.find(
          (a) => a.name === file.file_name,
        );

        if (!isAlreadyUploaded) {
          const uploadedAttachmentsCopy = uploadedAttachments;

          uploadedAttachmentsCopy.push({
            name: file.file_name,
            status: "uploaded",
            type: file.file_type,
          });
          setUploadedAttachments(uploadedAttachmentsCopy);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reimbursementFormValues.attachments]);

  const handleDrop = useCallback(
    (e: FileWithPath) => {
      const filesCopy = [...attachedFiles];
      filesCopy.push(e);
      setAttachedFiles(filesCopy);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleUpload],
  );

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
          handleResetRequestType();
          formReturn.reset();
          showToast({
            type: "success",
            description:
              "Your reimbursement request has been submitted successfully!",
          });
        })
        .catch((error: MutationError) => {
          if (error) {
            if (Array.isArray(error.data.errors)) {
              showToast({
                type: "error",
                description: error.data.errors[0].message,
              });
            } else {
              showToast({
                type: "error",
                description: error.data.message,
              });
            }
          }
        });
    } else {
      dispatch(setActiveStep(activeStep + 1));
    }
  };

  const fileValidator = (file: File) => {
    if (file.size > 50000000) {
      return {
        code: "size-too-large",
        message: `file is larger than 50MB`,
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
      setFileRejections([]);
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
          attachedFilesLength={attachedFiles.length}
          toggleCamera={() => {
            setShowCamera(!showCamera);
            setFileRejections([]);
          }}
        />
      </CollapseHeightAnimation>

      {!showCamera && (
        <>
          <AttachmentsList
            uploadedAttachments={uploadedAttachments}
            setUploadedAttachments={setUploadedAttachments}
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
                  isSubmitting
                }
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAttachments;
