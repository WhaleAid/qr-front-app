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
    const publicPaths = ["/authentication", "/register"]; // Define paths that don't require authentication
    const pathRequiresAuth = !publicPaths.includes(pathname);

    const accessToken = localStorage.getItem("accessToken");

    if (pathRequiresAuth && !accessToken) {
      console.log('No access token found, redirecting to /authentication.');
      router.push("/authentication");
    }

    if ((pathname === "/authentication" || pathname === "/") && accessToken) {
      console.log('Access token found, redirecting to /dashboard.');
      router.push("/dashboard");
    }
  }, [pathname, router]);

  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </StoreProvider>
  );
}