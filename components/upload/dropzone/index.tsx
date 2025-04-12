import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  setFile: (file: File) => void;
  file?: File;
};

const className =
  "flex flex-col items-center justify-center cursor-pointer h-[calc(20vh)] space-y-4 bg-black text-green-200 w-full place-items-center";

export default function DropZone({ setFile, file }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);

      console.log({ acceptedFiles });
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (file) {
    return <div className={className}>Selected file: {file.name}</div>;
  }

  return (
    <div {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag &apos;n&apos; drop the file here, or click to select file</p>
      )}
    </div>
  );
}
