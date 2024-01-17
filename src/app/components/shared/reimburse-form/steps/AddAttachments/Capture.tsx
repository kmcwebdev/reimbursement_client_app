/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import { Camera, type CameraType } from "react-camera-pro";
import { type UseFormReturn } from "react-hook-form";
import { IoMdImage } from "react-icons-all-files/io/IoMdImage";
import { MdCameraAlt } from "react-icons-all-files/md/MdCameraAlt";
import { MdOutlineDelete } from "react-icons-all-files/md/MdOutlineDelete";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import Dialog from "~/app/components/core/Dialog";
import SkeletonLoading from "~/app/components/core/SkeletonLoading";
import { showToast } from "~/app/components/core/Toast";
import IndeterminateProgressBar from "~/app/components/loaders/IndeterminateProgressBar";
import { useAppDispatch, useAppSelector } from "~/app/hook";

import {
  useCreateReimbursementMutation,
  useUploadFileMutation,
} from "~/features/api/reimbursement-form-api-slice";
import {
  clearReimbursementForm,
  setActiveStep,
  setReimbursementFormValues,
  setSelectedAttachmentMethod,
  toggleFormDialog,
} from "~/features/state/reimbursement-form-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";
import { type MutationError } from "~/types/global-types";
import { classNames } from "~/utils/classNames";

interface CaptureProps {
  formReturn: UseFormReturn<ParticularDetails>;
}

const Capture: React.FC<CaptureProps> = ({ formReturn }) => {
  const dispatch = useAppDispatch();
  const camera = useRef<CameraType>(null);
  const [cameraIsLoading, setCameraIsLoading] = useState<boolean>(true);
  const { activeStep, reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const [photo, setPhoto] = useState<string>();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [uploadedAttachments, setUploadedAttachments] = useState<
    { name: string; status: "uploading" | "uploaded" }[]
  >([]);

  const [uploadFiles, { isLoading: isUploading }] = useUploadFileMutation();

  const [createReimbursement, { isLoading: isSubmitting }] =
    useCreateReimbursementMutation();

  const { isVisible, open, close } = useDialogState();

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

          setPhoto(undefined);
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

  useMemo(() => {
    if (reimbursementFormValues.attachments.length > 0) {
      const uploadedAttachmentsCopy: {
        name: string;
        status: "uploaded" | "uploading";
      }[] = [];

      reimbursementFormValues.attachments.forEach((a) => {
        uploadedAttachmentsCopy.push({ name: a.file_name, status: "uploaded" });
      });

      setUploadedAttachments(uploadedAttachmentsCopy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reimbursementFormValues]);

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
        });
        setUploadedAttachments(uploadedAttachmentsCopy);
        handleUpload(attachedFiles[attachedFiles.length - 1]);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachedFiles]);

  const handleContinue = () => {
    if (reimbursementFormValues.request_type === 1) {
      const payload = {
        ...reimbursementFormValues,
      };

      if (reimbursementFormValues.request_type === 1) {
        delete payload["manager_approver_email"];
      }

      void createReimbursement(payload)
        .unwrap()
        .then(() => {
          dispatch(toggleFormDialog());
          dispatch(clearReimbursementForm());
          formReturn.reset();
          showToast({
            type: "success",
            description:
              "Your reimbursement request has been submitted successfully!",
          });
        })
        .catch((error: MutationError) => {
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
        });
    } else {
      dispatch(setActiveStep(activeStep + 1));
    }
  };

  return (
    <div className="relative flex flex-col gap-4">
      {cameraIsLoading && (
        <SkeletonLoading className="absolute z-[100] h-60 w-full rounded-md" />
      )}

      <div
        className={classNames(
          !cameraIsLoading ? "opacity-100" : "opacity-0",
          "relative h-60 overflow-hidden rounded-md",
        )}
      >
        <Camera
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to different one because there is only one video device accessible.",
            canvas: "Canvas is not supported.",
          }}
          facingMode="user"
          videoReadyCallback={() =>
            setTimeout(() => setCameraIsLoading(false), 1000)
          }
          ref={camera}
        />

        {photo && (
          <div
            className={classNames("relative h-60 overflow-hidden rounded-md")}
          >
            <Image src={photo} alt="test" fill />
          </div>
        )}

        <div className="absolute bottom-2 flex h-14 w-full items-center justify-center">
          {isUploading && (
            <div className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-full bg-white bg-opacity-40">
              <RiLoader4Fill className="h-6 w-6 animate-spin text-orange-600" />
            </div>
          )}
          {!isUploading && (
            <div
              className="grid h-10 w-10 cursor-pointer place-items-center  rounded-full bg-white bg-opacity-40"
              onClick={() => {
                const url = camera.current?.takePhoto();
                setPhoto(url);
                if (url) {
                  void fetch(url)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const attachment = new File(
                        [blob],
                        `Attachment-${attachedFiles.length + 1}`,
                        {
                          type: "image/png",
                        },
                      );

                      const attachFilesCopy = [...attachedFiles];
                      attachFilesCopy.push(attachment);
                      setAttachedFiles(attachFilesCopy);
                    });
                }
              }}
            >
              <MdCameraAlt className="h-6 w-6 cursor-pointer rounded-full text-orange-600 transition-all ease-in-out hover:text-orange-300" />
            </div>
          )}
        </div>
      </div>

      <CollapseHeightAnimation
        isVisible={uploadedAttachments.length > 0}
        className="flex flex-col gap-2"
      >
        <p className="font-medium text-neutral-900">Images</p>
        {uploadedAttachments.length > 0 &&
          uploadedAttachments.map((attachment, i) => (
            <div
              key={attachment.name}
              className="flex w-full items-center gap-3 rounded-md border p-2 px-3"
            >
              <div className="grid h-7 w-7 place-items-center rounded-full border border-neutral-300">
                <IoMdImage className="h-4 w-4 text-navy" />
              </div>

              <span className="w-10/12 gap-2 truncate  text-sm text-neutral-900">
                {attachment.status === "uploaded" ? (
                  <p>{reimbursementFormValues.attachments[i].file_name}</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p>Getting file URL..</p>
                    <IndeterminateProgressBar />
                  </div>
                )}
              </span>

              <MdOutlineDelete
                className="h-5 w-5 cursor-pointer text-red-600 transition-all ease-in-out hover:text-red-800"
                onClick={() => {
                  const uploadedAttachmentsCopy = uploadedAttachments;
                  uploadedAttachmentsCopy.splice(i, 1);
                  setUploadedAttachments(uploadedAttachmentsCopy);

                  const reimbursementAttachments =
                    reimbursementFormValues.attachments;
                  const updated = reimbursementAttachments.filter(
                    (a) => a.file_name !== attachment.name,
                  );

                  dispatch(
                    setReimbursementFormValues({
                      ...reimbursementFormValues,
                      attachments: updated,
                    }),
                  );
                }}
              />
            </div>
          ))}
      </CollapseHeightAnimation>

      <div className="grid grid-cols-2 items-center gap-2 pt-4">
        <div>
          <Button
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={
              reimbursementFormValues.attachments.length > 0
                ? () => open()
                : () => {
                    dispatch(
                      setReimbursementFormValues({
                        ...reimbursementFormValues,
                        attachments: [],
                      }),
                    );
                    dispatch(setSelectedAttachmentMethod(null));
                  }
            }
          >
            Return
          </Button>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={handleContinue}
          disabled={reimbursementFormValues.attachments.length === 0}
          loading={isSubmitting}
        >
          Continue
        </Button>
      </div>

      <Dialog
        title="Return to Previous Step?"
        isVisible={isVisible}
        close={close}
        hideCloseIcon
      >
        <div className="flex flex-col gap-8 pt-8">
          <p className="text-neutral-800">
            Uploaded files will be removed. Are you sure you want to return to
            the previous step?
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={close}
            >
              No
            </Button>
            <Button
              variant="danger"
              className="w-1/2"
              onClick={() => {
                dispatch(
                  setReimbursementFormValues({
                    ...reimbursementFormValues,
                    attachments: [],
                  }),
                );
                dispatch(setSelectedAttachmentMethod(null));
              }}
            >
              Yes, Return
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Capture;