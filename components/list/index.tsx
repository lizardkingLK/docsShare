"use client";

import { commonSectionStyle } from "@/constants";
import { FileListItem } from "pinata";
import React, { useState } from "react";
import CircularLoader from "../loader/circular";

type listType = { files: FileListItem[]; revalidate: () => void };

export default function List({ files, revalidate }: listType) {
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleUrl = async (cid: string) => {
    setLoading(true);
    await fetch("/api/urls", { method: "POST", body: JSON.stringify({ cid }) })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        const url = data?.data;
        window.navigator.clipboard.writeText(url);
        setMessage("COPIED! Link Expires in 1 hour.");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      });
  };

  if (!files) {
    return (
      <div className={commonSectionStyle}>
        <CircularLoader />
      </div>
    );
  }

  return (
    <section className="text-green-200 bg-black h-[calc(100vh)] w-full p-4">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl">Files List</h1>
        <div className="flex items-center space-x-4">
          <p className="text-sm">{message}</p>
          {isLoading ? (
            <CircularLoader />
          ) : (
            <button onClick={() => revalidate()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <table className="w-full overflow-scroll max-h-calc[(100vh)]">
        <thead>
          <tr>
            <th>#</th>
            <th className="text-right">Name</th>
            <th>Type</th>
            <th>Size (Kb)</th>
            <th>Created On</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => {
            const { id, mime_type, name, size, created_at, cid } = file;

            return (
              <tr key={id} className="border-y-2 border-green-200">
                <th className="py-4">{1 + index}</th>
                <th className="text-right">{name}</th>
                <th>{mime_type}</th>
                <th>{Math.round(size / 1000)}</th>
                <th>
                  {new Date(created_at)
                    .toLocaleString("en-us", {
                      hour12: false,
                    })
                    .replace(",", "")}
                </th>
                <th>
                  <button onClick={() => handleUrl(cid)}>COPY</button>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
