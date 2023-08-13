import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import Avatar from "@/components/Avatar";
import ReactCrop, { type Crop } from "react-image-crop";
import FileInput from "./FileInput";
import * as Dialog from "@radix-ui/react-dialog";
import "react-image-crop/dist/ReactCrop.css";

const getCroppedImg = (imageSrc: HTMLImageElement, crop: Crop): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  const scaleX = imageSrc.naturalWidth / imageSrc.width;
  const scaleY = imageSrc.naturalHeight / imageSrc.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.drawImage(imageSrc, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
};

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();

  const imageRef = useRef(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [image]);

  if (!user) return null;

  const handleOnCropComplete = async () => {
    if (!imageRef.current || !crop?.width || !crop?.height) return;

    const blob = await getCroppedImg(imageRef.current, crop);
    const url = URL.createObjectURL(blob);
    setCroppedImageUrl(url);
  };

  const onImageLoaded = () => {
    const cropContainer = cropContainerRef.current;

    if (!cropContainer) return;

    setCrop({
      unit: "px",
      x: 0,
      y: 0,
      width: cropContainer.clientWidth,
      height: cropContainer.clientHeight,
    });
  };

  return (
    <div className="flex flex-col border border-gray-700 bg-zinc-950 w-[500px] rounded-lg text-white p-8 gap-8">
      <h3 className="text-2xl font-bold">{user?.Username}</h3>
      <div className="flex justify-between items-center">
        <FileInput onFileChange={(file) => setImage(file)}>
          <button className="rounded-lg px-5 py-1.5 font-semibold bg-gray-800 border border-gray-700">Change avatar</button>
        </FileInput>
        <Avatar imageUrl={croppedImageUrl} className="w-12 h-12 pointer-events-none" />
      </div>
      <div
        ref={cropContainerRef}
        className="h-[150px] w-[150px] flex flex-col items-center justify-center border border-dotted border-gray-300"
      >
        {imageUrl && (
          <ReactCrop
            className="h-full w-full"
            aspect={1}
            circularCrop={true}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={handleOnCropComplete}
          >
            <img onLoad={onImageLoaded} ref={imageRef} className="object-contain" src={imageUrl} />
          </ReactCrop>
        )}
      </div>
      <button className="rounded-lg px-5 py-1.5 font-semibold bg-gray-800 border border-gray-700">Save</button>
    </div>
  );
};

export default Profile;
