"use client"

import SideBar from "@/components/SideBar";

export default function Home() {
  return (
      <main className="flex min-h-screen h-full flex-col items-center lg:p-16 p-6 relative">
        <div className="w-full dark:bg-gray-800 bg-white rounded-xl shadow-md transition-all h-screen-minus overflow-x-hidden">
          <SideBar />
        </div>
      </main>
  );
}
