import { twMerge } from "tailwind-merge";

interface AvatarProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  displayLetter?: string;
  className?: string;
  imageUrl?: string;
}

const Avatar = ({ onClick, displayLetter, className, imageUrl }: AvatarProps) => {
  const backgroundStyle = imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover" } : {};

  return (
    <div
      onClick={onClick}
      style={backgroundStyle}
      className={twMerge(
        "cursor-pointer hover:bg-indigo-400 h-[36px] w-[36px] rounded-full bg-indigo-300 flex items-center justify-center text-black",
        className
      )}
    >
      {!imageUrl && displayLetter}
    </div>
  );
};

export default Avatar;
