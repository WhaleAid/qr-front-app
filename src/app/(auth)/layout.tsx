import Link from "next/link";

import Image from "next/image";

export default function AuthLayout(props: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen h-full flex-col items-center lg:p-16 p-5 relative">
            <div className="w-full dark:bg-gray-800 bg-white rounded-xl shadow-md m-auto overflow-auto transition-all p-8 xl:h-screen-minus h-full">
                {props.children}
            </div>
        </main>
    );
}
