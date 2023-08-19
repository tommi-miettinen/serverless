import { useState, useEffect, useRef } from "react";
import { useUserStore, updateUser, getName, getAvatarUrl } from "@/store/userStore";
import Avatar from "@/components/Avatar";
import ReactCrop, { type Crop } from "react-image-crop";
import FileInput from "./FileInput";
import "react-image-crop/dist/ReactCrop.css";
import Spinner from "./Spinner";

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

const uploadToServer = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch("/api/images", {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();
  return responseData;
};

interface ProfileProps {
  onSave: () => void;
}

enum SaveState {
  None = "none",
  Saving = "saving",
  Saved = "saved",
}

const saveLabels: Record<SaveState, JSX.Element> = {
  [SaveState.None]: <span>Save</span>,
  [SaveState.Saving]: (
    <>
      <span>Saving</span>
      <Spinner className="font-semibold w-5 h-5 translate-y-[1.5px] text-gray-700 fill-indigo-400" />
    </>
  ),

  [SaveState.Saved]: (
    <>
      <span>Saved</span>
      <svg
        className="duration-200 scale w-5 h-5 translate-y-[1.5px] mr-2 text-indigo-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
      </svg>
    </>
  ),
};

const Profile = ({ onSave }: ProfileProps) => {
  const avatarUrl = getAvatarUrl() || "";
  const user = useUserStore((state) => state.user);
  const [image, setImage] = useState<File | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>(avatarUrl);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [saveState, setSaveState] = useState<SaveState>(SaveState.None);

  const imageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [image, imageLoaded]);

  useEffect(() => {
    if (saveState === SaveState.Saved) {
      const timeoutId = setTimeout(() => {
        onSave();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [saveState, onSave]);

  if (!user) return null;

  const handleOnCropComplete = async () => {
    if (!imageRef.current || !crop?.width || !crop?.height) return;

    const blob = await getCroppedImg(imageRef.current, crop);
    const url = URL.createObjectURL(blob);
    setCroppedImageUrl(url);
    setCroppedImage(
      new File([blob], "cropped-image.jpeg", {
        type: "image/jpeg",
      })
    );
  };

  const onImageLoaded = () => {
    const cropContainer = cropContainerRef.current;

    if (!cropContainer) return;

    const w = cropContainer.clientWidth;
    const h = cropContainer.clientHeight;

    const height = w > h ? h : w;
    const width = w < h ? w : h;

    setImageLoaded(true);
    setCrop({
      unit: "px",
      x: 0,
      y: 0,
      width,
      height,
    });
  };

  const handleUpload = async () => {
    try {
      const response = await uploadToServer(croppedImage as File);
      await updateUser({ ...user, UserAttributes: [{ Name: "custom:avatarUrl", Value: response.imageUrl }] });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    setSaveState(SaveState.Saving);
    if (croppedImage) await handleUpload();
    setSaveState(SaveState.Saved);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 w-screen sm:w-[500px] text-white py-0 pb-2 px-4 sm:p-8 gap-8">
      <h3 className="text-2xl font-bold">{getName()}</h3>
      <div className="flex flex-col gap-8 border-gray-700">
        <div className="flex justify-between items-center">
          <FileInput onFileChange={(file) => setImage(file)}>
            <button className="hover:bg-opacity-80 rounded-lg px-5 py-2 bg-gray-800">Change avatar</button>
          </FileInput>
          <Avatar imageUrl={croppedImageUrl} className="w-12 h-12 pointer-events-none" />
        </div>
        {imageUrl && (
          <div ref={cropContainerRef} className="max-h-[150px] border-gray-300">
            <ReactCrop
              className="max-h-[150px] border border-dotted"
              aspect={1}
              circularCrop={true}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleOnCropComplete}
            >
              <img onLoad={onImageLoaded} ref={imageRef} className="object-fit" src={imageUrl} />
            </ReactCrop>
          </div>
        )}
      </div>
      <button onClick={handleSave} className="hover:bg-opacity-80 rounded-lg px-5 py-2 bg-gray-800  mt-auto">
        <span className="flex items-center justify-center gap-2">{saveLabels[saveState]}</span>
      </button>
    </div>
  );
};

export default Profile;
