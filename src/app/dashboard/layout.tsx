"use client"

import SideBar from "@/components/SideBar";

export default function DashboardLayout(props: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen h-full flex-col items-center lg:p-16 p-6 relative overflow-hidden">
            <div className="w-full relative flex dark:bg-gray-800 bg-[#f7f5ff] rounded-xl shadow-md transition-all lg:h-screen-minus h-screen-minus-mobile">
                {/* <SideBar /> */}
                {props.children}
            </div>
        </main>
    )
}