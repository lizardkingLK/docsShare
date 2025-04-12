"use client";

import { useState } from "react";
import { pinata } from "@/utils/config";
import DropZone from "./dropzone";
import Link from "next/link";
import CircularLoader from "../loader/circular";
import { UserButton, useUser } from "@clerk/nextjs";
import { commonSectionStyle } from "@/constants";
import { groupType } from "../list/types";

export default function Upload({ id }: groupType) {
  const { user } = useUser();

  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setUploading(true);
      const urlRequest = await fetch(`/api/urls?groupId=${id}`);
      const urlResponse = await urlRequest.json();
      const upload = await pinata.upload.public.file(file).url(urlResponse.url);
      const fileUrl = await pinata.gateways.public.convert(upload.cid);
      setUrl(fileUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  if (!user || !id) {
    return (
      <div className={commonSectionStyle}>
        <CircularLoader />
      </div>
    );
  }

  const handleReset = () => {
    setFile(undefined);
    setUrl("");
  };

  return (
    <div className={commonSectionStyle}>
      <nav className="font-bold text-4xl flex justify-between items-center w-full px-4">
        <div>
          <h1>DocsShare</h1>
        </div>
        <UserButton />
      </nav>
      <DropZone setFile={setFile} file={file} />
      <div className="flex gap-4">
        {!url && file && (
          <button
            disabled={uploading}
            onClick={uploadFile}
            className="w-full bg-green-200 text-black font-black text-2xl"
            title="Click to Upload"
          >
            {uploading ? <CircularLoader /> : "Upload"}
          </button>
        )}
        {url && (
          <Link href={url} target="_blank">
            <p className="text-center text-2xl font-black" title="Click to Download">DOWNLOAD</p>
          </Link>
        )}
        {file && (
          <button
            className="text-center text-2xl text-red-500"
            onClick={handleReset}
            title="Click to Change File">
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
