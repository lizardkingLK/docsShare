"use client";

import List from "@/components/list";
import { groupType } from "@/components/list/types";
import CircularLoader from "@/components/loader/circular";
import Upload from "@/components/upload";
import { commonSectionStyle } from "@/constants";
import { FileListItem } from "pinata";
import { useState, useCallback, useEffect } from "react";

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [group, setGroup] = useState<groupType | null>(null);
  const [files, setFiles] = useState<FileListItem[]>([]);

  const initializeGroup = useCallback(async () => {
    await fetch("/api/groups", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        const userGroup = data?.data;
        setGroup(userGroup);
        setLoading(false);
      });
  }, []);

  const initializeFiles = useCallback(async () => {
    if (group?.id) {
      await fetch("/api/files?groupId=" + group.id)
        .then((response) => response.json())
        .then((data) => {
          const files = data?.data;
          setFiles(files);
        });
    }
  }, [group?.id]);

  useEffect(() => {
    const initialize = async () => {
      await initializeGroup();
      setLoading(false);
    };

    initialize();
  }, [initializeGroup]);

  useEffect(() => {
    const initialize = async () => {
      await initializeFiles();
    };

    initialize();
  }, [initializeFiles]);

  if (isLoading || !group) {
    return (
      <div className={commonSectionStyle}>
        <CircularLoader />
      </div>
    );
  }

  return (
    <main className="block lg:flex items-center justify-center bg-green-200 text-black font-mono h-[calc(100vh)]">
      <Upload id={group.id} />
      <List files={files} revalidate={initializeFiles} />
    </main>
  );
}
