"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const publicPaths = ["/authentication"];
    const pathRequiresAuth = !publicPaths.includes(pathname);

    const accessToken = localStorage.getItem("accessToken");

    if (pathRequiresAuth && !accessToken) {
      router.push("/authentication");
    } else if (pathname === "/authentication" && accessToken) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  }, [router]);

  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </StoreProvider>
  );
}