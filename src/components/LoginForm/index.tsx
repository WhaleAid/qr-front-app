"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/utils/cn";
import toast, { Toaster } from "react-hot-toast";
import { useLoginMutation } from "@/services/authService";
import { CustomError } from "@/app/types/error";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();

  const notify = (message: string, theme: any) => {
    toast(message, { ...theme, position: "top-right", duration: 4000 });
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login({ email, password }).unwrap();
      notify("Connexion réussie!", { icon: "✅", style: { background: "#fff", color: "#000" } });
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err)
      notify((err as CustomError).data || "Une erreur s'est produite.", { icon: "❌", style: { background: "#fff", color: "#000" } });
    }
  };

  return (
    <div className="max-w-xl w-full my-auto md:mx-auto mx-0 rounded-none md:rounded-2xl p-4 md:p-8 bg-white dark:bg-black transition-all">
      <div className="flex w-full justify-between gap-12 items-center mb-4">
        <img src="/assets/imgs/turnadon-logo.png" alt="logo" className="w-20 h-20" />
        <h2 className="font-bold lg:text-xl text-md text-neutral-800 dark:text-neutral-200 text-end">
          Bienvenue sur L'application Turnadon
        </h2>
      </div>
      <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quod a quos quas quae quia, quibusdam quidem.
      </p>

      <form className="mt-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="exemple@mail.com" type="email" required />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" placeholder="••••••••" type="password" required />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn animate-shimmer from-[#7A63EB] dark:from-zinc-900 dark:to-zinc-900 to-[#5C9BEB] block dark:bg-zinc-800 w-full text-white rounded-full h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isLoading}
        >
          Connexion &rarr;
          <BottomGradient />
        </button>
        <Toaster />

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};