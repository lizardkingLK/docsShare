"use client";

import { FileListItem } from "pinata";
import React, { useState } from "react";
import CircularLoader from "../loader/circular";
import ChevronLeft from "./ChevronLeft";
import ChevronRight from "./ChevronRight";
import RefreshIcon from "./RefreshIcon";

type listType = {
  files: FileListItem[];
  revalidate: () => void;
  pageIndex: number;
  nextPageToken: string | null;
  isListLoading: boolean;
  paginateFiles: (pageIndex: number) => void;
};

export default function List({
  files,
  revalidate,
  pageIndex,
  nextPageToken,
  isListLoading,
  paginateFiles,
}: listType) {
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

  return (
    <section className="text-green-200 bg-black h-[calc(100vh)] w-full p-4">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl">Files List</h1>
        <div className="flex items-center space-x-4">
          <p className="text-sm">{message}</p>
          {isLoading ? (
            <CircularLoader />
          ) : (
            <button onClick={() => revalidate()} title="Click to Refresh">
              <RefreshIcon />
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
              <tr
                key={id}
                className={`border-y-2 border-green-200 ${
                  isListLoading ? "blur-sm" : ""
                }`}
              >
                <th className="py-4">{pageIndex * 10 + (1 + index)}</th>
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
                  <button
                    className="text-green-200 hover:text-green-400"
                    title="Click to copy the URL"
                    onClick={() => handleUrl(cid)}
                  >
                    COPY
                  </button>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
      {nextPageToken && (
        <div className="py-4 justify-between flex text-xl font-black">
          <div>
            {pageIndex !== 0 && (
              <button
                onClick={() => paginateFiles(pageIndex - 1)}
                title="Go to Previous Page"
              >
                <ChevronLeft />
              </button>
            )}
          </div>
          <p className="text-green-200">{pageIndex + 1}</p>
          <div>
            {files.length >= 10 && (
              <button
                onClick={() => paginateFiles(pageIndex + 1)}
                title="Go to Next Page"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
