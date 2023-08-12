const Avatar = ({ onClick, displayLetter }: { onClick: (e: React.MouseEvent<HTMLDivElement>) => void; displayLetter: string }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer hover:bg-indigo-400 h-[36px] w-[36px] rounded-full bg-indigo-300 flex items-center text-black justify-center"
    >
      {displayLetter}
    </div>
  );
};

export default Avatar;
