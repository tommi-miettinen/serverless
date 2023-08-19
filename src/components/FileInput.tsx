import { useRef } from "react";

interface FileInputProps {
  children: JSX.Element;
  className?: string;
  onFileChange?: (file: File) => void;
}

const FileInput = ({ className, children, onFileChange }: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (onFileChange && file) {
      onFileChange(file);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
      aria-label="Upload file"
      role="button"
      className={className}
      onClick={() => fileInputRef.current?.click()}
    >
      <input className="hidden" type="file" ref={fileInputRef} onChange={handleFileChange} />
      {children}
    </div>
  );
};

export default FileInput;
