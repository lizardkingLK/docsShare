"use client";

import List from "@/components/list";
import { groupType } from "@/components/list/types";
import CircularLoader from "@/components/loader/circular";
import Upload from "@/components/upload";
import { commonSectionStyle } from "@/constants";
import { FileListItem } from "pinata";
import { useState, useCallback, useEffect } from "react";

export default function Dashboard() {
  const [isDashboardLoading, setDashboardLoading] = useState(true);
  const [isListLoading, setListLoading] = useState(true);
  const [group, setGroup] = useState<groupType | null>(null);
  const [files, setFiles] = useState<FileListItem[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageFiles, setPageFiles] = useState<
    {
      pageIndex: number;
      files: FileListItem[];
    }[]
  >([]);
  const [nextPageToken, setNextPageToken] = useState(null);

  const initializeGroup = useCallback(async () => {
    await fetch("/api/groups", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        const userGroup = data?.data;
        setGroup(userGroup);
        setDashboardLoading(false);
      });
  }, []);

  const initializeFiles = useCallback(async () => {
    if (!group?.id) {
      return;
    }

    setListLoading(true)
    await fetch(`/api/files?groupId=${group.id}`)
      .then((response) => response.json())
      .then((data) => {
        const { files, nextPageToken } = data?.data;
        setPageIndex(0);
        setFiles(files);
        setPageFiles([{ pageIndex: 0, files }]);
        setNextPageToken(nextPageToken);
        setListLoading(false);
      });
  }, [group?.id]);

  const paginateFiles = async (pageIndex: number) => {
    if (!group?.id) {
      return;
    }

    setPageIndex(pageIndex);

    if (pageIndex < pageFiles.length) {
      setFiles(pageFiles[pageIndex].files);
      return;
    }

    let getFilesUrl = `/api/files?groupId=${group.id}`;
    if (nextPageToken) {
      getFilesUrl += `&nextPageToken=${nextPageToken}`;
    }

    setListLoading(true);
    await fetch(getFilesUrl)
      .then((response) => response.json())
      .then((data) => {
        const { files, nextPageToken } = data?.data;
        setFiles(files);
        setNextPageToken(nextPageToken);
        setPageFiles([...pageFiles, { pageIndex, files }]);
        setListLoading(false);
      });
  };

  useEffect(() => {
    const initialize = async () => {
      await initializeGroup();
      setDashboardLoading(false);
    };

    initialize();
  }, [initializeGroup]);

  useEffect(() => {
    const initialize = async () => {
      await initializeFiles();
    };

    initialize();
  }, [initializeFiles]);

  if (isDashboardLoading || !group) {
    return (
      <div className={commonSectionStyle}>
        <CircularLoader />
      </div>
    );
  }

  return (
    <main className="block lg:flex items-center justify-center bg-green-200 text-black font-mono h-[calc(100vh)]">
      <Upload id={group.id} />
      <List
        files={files}
        revalidate={initializeFiles}
        pageIndex={pageIndex}
        nextPageToken={nextPageToken}
        isListLoading={isListLoading}
        paginateFiles={paginateFiles}
      />
    </main>
  );
}
