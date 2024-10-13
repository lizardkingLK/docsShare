"use server";

import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center bg-green-200 text-black font-mono h-[calc(100vh)]">
      <h1 className="p-4 text-[10vw] w-full">DocsShare</h1>
      <Link
        href={"/dashboard"}
        className="p-4 text-[10vw] w-full bg-black text-green-200 border-black delay-150 hover:border-green-200 border-8"
      >
        <h1>Dashboard</h1>
      </Link>
    </main>
  );
}
