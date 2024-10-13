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
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload.file(file).key(keyData.JWT).group(id);
      const urlReuest = await fetch("/api/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cid: upload.cid }),
      });
      const url = await urlReuest.json();
      setUrl(url);
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

  return (
    <div className={commonSectionStyle}>
      <nav className="font-bold text-4xl flex justify-between items-center w-full px-4">
        <div>
          <h1>DocsShare</h1>
        </div>
        <UserButton />
      </nav>
      <DropZone setFile={setFile} />
      {!url && file && (
        <button
          disabled={uploading}
          onClick={uploadFile}
          className="w-full bg-green-200 text-black text-2xl"
        >
          {uploading ? <CircularLoader /> : "Upload"}
        </button>
      )}
      {url && (
        <Link href={url} target="_blank">
          <p className="text-center text-2xl font-black">DOWNLOAD</p>
        </Link>
      )}
    </div>
  );
}
