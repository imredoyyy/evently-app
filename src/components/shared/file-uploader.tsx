"use client";

import { Dispatch, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  image: string;
  onFieldChange: (url: string) => void;
  setFiles: Dispatch<React.SetStateAction<File[]>>;
};

export const FileUploader = ({
  image,
  onFieldChange,
  setFiles,
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0].size > 4 * 1024 * 1024) {
        setFiles([]);
        toast.error("Image size must be less than 4MB");
        return;
      }
      setFiles(files);
      onFieldChange(convertFileToUrl(files[0]));
    },
    [setFiles, onFieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full mx-auto max-w-sm flex justify-center items-center h-72 cursor-pointer flex-col overflow-hidden rounded-md bg-muted"
    >
      <input
        {...getInputProps()}
        type="file"
        name="image"
        className="cursor-pointer"
      />

      {image ? (
        <div className="flex h-full w-full flex-1 justify-center border overflow-hidden">
          <Image
            src={image}
            alt="Uploaded"
            width={400}
            height={320}
            className="object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex flex-col py-5 justify-center items-center">
          <UploadIcon className="size-12 text-muted-foreground" />
          <h3 className="my-2">Drag and drop or select an image</h3>
          <p className="font-medium m-4 text-sm text-muted-foreground">
            PNG, JPG up to 4MB
          </p>
          <Button type="button">Upload a file</Button>
        </div>
      )}
    </div>
  );
};
