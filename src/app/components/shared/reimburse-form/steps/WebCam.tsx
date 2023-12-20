/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useRef, useState } from "react";
import { Camera, type CameraType } from "react-camera-pro";
import { IoMdImage } from "react-icons-all-files/io/IoMdImage";
import { MdCameraAlt } from "react-icons-all-files/md/MdCameraAlt";
import { MdOutlineDelete } from "react-icons-all-files/md/MdOutlineDelete";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import SkeletonLoading from "~/app/components/core/SkeletonLoading";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { SCHEDULED } from "~/constants/request-types";
import {
  setActiveStep,
  setReimbursementFormValues,
} from "~/features/reimbursement-form-slice";
import { classNames } from "~/utils/classNames";

const WebCam: React.FC = () => {
  const camera = useRef<CameraType>(null);
  const [cameraIsLoading, setCameraIsLoading] = useState<boolean>(true);
  const { activeStep, reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  const dispatch = useAppDispatch();

  const handleNext = () => {
    if (reimbursementFormValues.reimbursement_request_type_id === SCHEDULED) {
      console.log(reimbursementFormValues);
    } else {
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

        <div className="absolute bottom-2 flex h-14 w-full cursor-pointer items-center justify-center">
          <div
            className="grid h-10 w-10 place-items-center rounded-full  bg-white bg-opacity-40"
            onClick={() => {
              const url = camera.current?.takePhoto();

              if (url) {
                void fetch(url)
                  .then((res) => res.blob())
                  .then((blob) => {
                    const file = new File(
                      [blob],
                      `File-${reimbursementFormValues.attachments.length + 1}`,
                      {
                        type: "image/png",
                      },
                    );
                    const filesCopy = [...reimbursementFormValues.attachments];
                    filesCopy.push(file);
                    dispatch(
                      setReimbursementFormValues({
                        ...reimbursementFormValues,
                        attachments: filesCopy,
                      }),
                    );
                  });
              }
            }}
          >
            <MdCameraAlt className="h-6 w-6 cursor-pointer rounded-full text-orange-600 transition-all ease-in-out hover:text-orange-300" />
          </div>
        </div>
      </div>

      <CollapseHeightAnimation
        isVisible={
          reimbursementFormValues.attachments &&
          reimbursementFormValues.attachments.length > 0
        }
        className="flex flex-col gap-2"
      >
        {reimbursementFormValues.attachments &&
          reimbursementFormValues.attachments.length > 0 &&
          reimbursementFormValues.attachments.map((a, i) => (
            <div
              key={a.name}
              className="flex w-full items-center gap-3 rounded-md border p-2 px-3"
            >
              <div className="grid h-7 w-7 place-items-center rounded-full border border-neutral-300">
                <IoMdImage className="h-4 w-4 text-neutral-800" />
              </div>

              <span className="w-10/12 truncate text-sm text-neutral-900">
                {a.name}
              </span>

              <MdOutlineDelete
                className="h-5 w-5 cursor-pointer text-red-600 transition-all ease-in-out hover:text-red-800"
                onClick={() => {
                  if (i > -1) {
                    const filesCopy = [...reimbursementFormValues.attachments];

                    filesCopy.splice(i, 1);

                    dispatch(
                      setReimbursementFormValues({
                        ...reimbursementFormValues,
                        attachments: filesCopy,
                      }),
                    );
                  }
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
            onClick={() => dispatch(setActiveStep(activeStep - 1))}
          >
            Return
          </Button>
        </div>

        <Button type="button" className="w-full" onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WebCam;
