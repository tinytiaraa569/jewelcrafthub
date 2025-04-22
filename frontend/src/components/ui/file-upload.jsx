import React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

const FileUpload = ({ onFilesSelected, accept }) => {
  const onDrop = (acceptedFiles) => {
    onFilesSelected(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
        isDragActive
          ? "border-[var(--primary-color)] bg-gray-100"
          : "border-gray-300 dark:border-neutral-600"
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-10 h-10 text-[var(--primary-color)] mb-2" />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {isDragActive
          ? "Drop your files here..."
          : "Drag and drop files here, or click to select files"}
      </p>
    </div>
  );
};

export default FileUpload;
