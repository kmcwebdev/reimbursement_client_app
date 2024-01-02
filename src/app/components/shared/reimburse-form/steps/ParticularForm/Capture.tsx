/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import { Camera, type CameraType } from "react-camera-pro";
import { UseFormReturn } from "react-hook-form";
import { IoMdImage } from "react-icons-all-files/io/IoMdImage";
import { MdCameraAlt } from "react-icons-all-files/md/MdCameraAlt";
import { MdOutlineDelete } from "react-icons-all-files/md/MdOutlineDelete";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import SkeletonLoading from "~/app/components/core/SkeletonLoading";
import { showToast } from "~/app/components/core/Toast";
import IndeterminateProgressBar from "~/app/components/loaders/IndeterminateProgressBar";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useUploadFileMutation } from "~/features/reimbursement-api-slice";
import {
  setActiveParticularIndex,
  setActiveParticularStep,
  setReimbursementFormValues,
} from "~/features/reimbursement-form-slice";
import { type ReimbursementParticularDetails } from "~/schema/reimbursement-particulars.schema";
import { classNames } from "~/utils/classNames";

interface CaptureProps {
  formReturn: UseFormReturn<ReimbursementParticularDetails>;
}

const Capture: React.FC<CaptureProps> = ({ formReturn }) => {
  const dispatch = useAppDispatch();
  const camera = useRef<CameraType>(null);
  const [cameraIsLoading, setCameraIsLoading] = useState<boolean>(true);
  const { reimbursementFormValues, activeParticularIndex } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  const [photo, setPhoto] = useState<string>();
  const [attachedFile, setAttachedFile] = useState<File>();

  useMemo(() => {
    if (
      activeParticularIndex &&
      reimbursementFormValues.particulars[+activeParticularIndex]
    ) {
      setPhoto(
        reimbursementFormValues.particulars[+activeParticularIndex].attachment,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reimbursementFormValues]);

  const [uploadFiles, { isLoading: isUploading }] = useUploadFileMutation();

  const handleUpload = (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      void uploadFiles(formData)
        .unwrap()
        .then((data) => {
          if (data && activeParticularIndex) {
            const particularsCopy = [...reimbursementFormValues.particulars];

            const selected = particularsCopy[+activeParticularIndex];

            if (selected) {
              particularsCopy[+activeParticularIndex] = {
                ...selected,
                attachment: data.url,
              };

              dispatch(
                setReimbursementFormValues({
                  ...reimbursementFormValues,
                  particulars: particularsCopy,
                }),
              );
              setAttachedFile(undefined);
            }
          }
        })
        .catch(() => {
          showToast({
            type: "error",
            description:
              "There was a problem uploading attachments. Please try again!",
          });
        });
    }
  };

  useMemo(() => {
    if (attachedFile !== undefined) {
      handleUpload(attachedFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachedFile]);

  const handleContinue = () => {
    formReturn.reset();
    dispatch(setActiveParticularIndex(null));
    dispatch(setActiveParticularStep("particular-list"));
  };

  return (
    <div className="relative flex flex-col gap-4">
      {cameraIsLoading && (
        <SkeletonLoading className="absolute z-[100] h-60 w-full rounded-md" />
      )}

      {!photo && (
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
                        const attachment = new File([blob], `Attachment`, {
                          type: "image/png",
                        });

                        setAttachedFile(attachment);
                      });
                  }
                }}
              >
                <MdCameraAlt className="h-6 w-6 cursor-pointer rounded-full text-orange-600 transition-all ease-in-out hover:text-orange-300" />
              </div>
            )}
          </div>
        </div>
      )}

      {photo && (
        <div className={classNames("relative h-60 overflow-hidden rounded-md")}>
          <Image src={photo} alt="test" fill />
        </div>
      )}

      <CollapseHeightAnimation
        isVisible={
          activeParticularIndex &&
          reimbursementFormValues.particulars &&
          reimbursementFormValues.particulars.length > 0 &&
          reimbursementFormValues.particulars[+activeParticularIndex] &&
          (reimbursementFormValues.particulars[+activeParticularIndex]
            .attachment ||
            attachedFile)
            ? true
            : false
        }
        className="flex flex-col gap-2"
      >
        {activeParticularIndex &&
          reimbursementFormValues.particulars.length > 0 &&
          reimbursementFormValues.particulars[+activeParticularIndex] && (
            <div className="flex w-full items-center gap-3 rounded-md border p-2 px-3">
              <div className="grid h-7 w-7 place-items-center rounded-full border border-neutral-300">
                <IoMdImage className="h-4 w-4 text-neutral-800" />
              </div>

              <span className="w-10/12 gap-2 truncate  text-sm text-neutral-900">
                {reimbursementFormValues.particulars[+activeParticularIndex]
                  .attachment ? (
                  <p>
                    {
                      reimbursementFormValues.particulars[
                        +activeParticularIndex
                      ].attachment
                    }
                  </p>
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
                  if (reimbursementFormValues.particulars.length > 0) {
                    const particularsCopy = [
                      ...reimbursementFormValues.particulars,
                    ];
                    const selected = particularsCopy[+activeParticularIndex];
                    setPhoto(undefined);
                    particularsCopy[+activeParticularIndex] = {
                      ...selected,
                      attachment: undefined,
                    };
                    setAttachedFile(undefined);
                    dispatch(
                      setReimbursementFormValues({
                        ...reimbursementFormValues,
                        particulars: particularsCopy,
                      }),
                    );
                  }
                }}
              />
            </div>
          )}
      </CollapseHeightAnimation>

      <div className="grid grid-cols-2 items-center gap-2 pt-4">
        <div>
          <Button
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={() => {
              dispatch(setActiveParticularStep("method-selection"));
            }}
          >
            Return
          </Button>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={handleContinue}
          disabled={
            activeParticularIndex &&
            reimbursementFormValues.particulars &&
            reimbursementFormValues.particulars.length > 0 &&
            reimbursementFormValues.particulars[+activeParticularIndex] &&
            !reimbursementFormValues.particulars[+activeParticularIndex]
              .attachment &&
            isUploading
              ? true
              : false
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Capture;
