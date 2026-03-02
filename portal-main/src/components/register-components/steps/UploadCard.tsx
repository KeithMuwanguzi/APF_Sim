import { useRef, useState } from "react";

type CloudUploadProps = {
  title: string;
  description: string;
  accept: string;
  maxSizeMB: number;
  onFileSelected?: (file: File) => void;
  onFileRemoved?: () => void;
  existingFile?: File | null;
  existingError?: string | null;
};

function CloudUpload({
  title,
  description,
  accept,
  maxSizeMB,
  onFileSelected,
  onFileRemoved,
  existingFile,
  existingError,
}: CloudUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(existingFile || null);
  const [error, setError] = useState<string | null>(existingError || null);

  const handleFile = (file?: File) => {
    if (!file) return;
     if (file.type.startsWith("video/")) {
    const errorMsg = "Video files are not allowed. Please upload an image or PDF.";
    setError(errorMsg);
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
    return;
  }

    if (file.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = `File must be less than ${maxSizeMB}MB`;
      setError(errorMsg);
      setFile(null);
      return;
    }

    setError(null);
    setFile(file);
    
    // Notify parent component
    if (onFileSelected) {
      onFileSelected(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    
    // Reset the input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Notify parent component
    if (onFileRemoved) {
      onFileRemoved();
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 transition p-4 sm:p-6"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-600">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 17.58A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 15.25" />
            <path d="M12 12v9" />
            <path d="M8 17l4-4 4 4" />
          </svg>
        </div>

        <div className="flex-1">
    
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-gray-800">{title}</p>

            {file && (
              <span className="flex items-center justify-between text-xs text-gray-700 mt-0.5 gap-2">
                <span className="w-3 h-3 flex items-center justify-center bg-purple-100 rounded-full border border-black">
                  <svg
                    width="7"
                    height="7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{file.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className="ml-2 text-red-600 hover:text-red-800 transition"
                  title="Remove file"
                  type="button"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-1">{description}</p>

          {!file && !error && (
            <p className="text-xs text-purple-600 font-medium mt-1">
              Click to upload
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CloudUpload;