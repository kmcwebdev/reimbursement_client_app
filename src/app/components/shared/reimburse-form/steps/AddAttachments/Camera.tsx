import Image from "next/image";
import React, { useRef, useState } from "react";
import { Camera as CameraPro, type CameraType } from "react-camera-pro";
import { FaChevronLeft } from "react-icons-all-files/fa/FaChevronLeft";
import { IoMdCloseCircle } from "react-icons-all-files/io/IoMdCloseCircle";
import { MdCameraAlt } from "react-icons-all-files/md/MdCameraAlt";
import { MdCameraswitch } from "react-icons-all-files/md/MdCameraswitch";
import { MdCheckCircle } from "react-icons-all-files/md/MdCheckCircle";
import SkeletonLoading from "~/app/components/core/SkeletonLoading";

import { classNames } from "~/utils/classNames";

interface CameraProps {
  attachedFilesLength: number;
  onProceed: (attachment: File) => void;
  toggleCamera: () => void;
}

const Camera: React.FC<CameraProps> = ({
  onProceed,
  attachedFilesLength,
  toggleCamera,
}) => {
  const camera = useRef<CameraType>(null);
  const [cameraIsLoading, setCameraIsLoading] = useState<boolean>(true);
  const [numberOfCameras, setNumberOfCameras] = useState<number>(0);
  const [photo, setPhoto] = useState<string>();
  const [attachment, setAttachment] = useState<File>();

  const handleCapture = () => {
    const url = camera.current?.takePhoto();
    setPhoto(url);
    if (url) {
      void fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const attachment = new File(
            [blob],
            `Attachment-${attachedFilesLength + 1}`,
            {
              type: "image/png",
            },
          );

          setAttachment(attachment);
        });
    }
  };

  const onContinue = () => {
    if (attachment) {
      onProceed(attachment);
    }
  };

  return (
    <div className="relative flex flex-col gap-4 pt-4">
      {cameraIsLoading && (
        <SkeletonLoading className="absolute z-[100] h-[60vh] w-full rounded-md" />
      )}

      <div
        className={classNames(
          !cameraIsLoading ? "opacity-100" : "opacity-0",
          "relative h-[60vh] overflow-hidden rounded-md",
        )}
      >
        <CameraPro
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to different one because there is only one video device accessible.",
            canvas: "Canvas is not supported.",
          }}
          facingMode="environment"
          numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
          videoReadyCallback={() =>
            setTimeout(() => setCameraIsLoading(false), 1000)
          }
          ref={camera}
        />

        {photo && (
          <div
            className={classNames(
              "relative h-[60vh] overflow-hidden rounded-md",
            )}
          >
            <Image src={photo} alt="test" fill />
          </div>
        )}

        <div className="absolute left-4 top-4 h-8 w-8">
          <FaChevronLeft
            className="h-6 w-6 cursor-pointer text-white transition-all ease-in-out hover:text-orange-600"
            onClick={toggleCamera}
          />
        </div>
        {numberOfCameras > 1 && (
          <div className="absolute right-4 top-4 h-8 w-8 ">
            <MdCameraswitch
              className="h-6 w-6 cursor-pointer text-white transition-all ease-in-out hover:text-orange-600"
              onClick={() => {
                if (camera.current) {
                  const result = camera.current.switchCamera();
                  console.log(result);
                }
              }}
            />
          </div>
        )}

        <div className="absolute bottom-4 flex h-14 w-full items-center justify-center">
          {photo && (
            <div className="flex gap-10">
              <div
                className="grid h-10 w-10 cursor-pointer place-items-center  rounded-full bg-black"
                onClick={() => setPhoto(undefined)}
              >
                <IoMdCloseCircle className="h-6 w-6 cursor-pointer rounded-full text-orange-600 transition-all ease-in-out hover:text-orange-300" />
              </div>

              <div
                className="grid h-10 w-10 cursor-pointer place-items-center  rounded-full bg-black"
                onClick={onContinue}
              >
                <MdCheckCircle className="h-6 w-6 cursor-pointer rounded-full text-green-600 transition-all ease-in-out hover:text-green-700" />
              </div>
            </div>
          )}

          {!photo && (
            <div
              className="grid h-10 w-10 cursor-pointer place-items-center  rounded-full bg-black"
              onClick={handleCapture}
            >
              <MdCameraAlt className="h-6 w-6 cursor-pointer rounded-full text-orange-600 transition-all ease-in-out hover:text-orange-700" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Camera;
