"use client";
import React, { use, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/utils/cn";
import { Form, FormikHelpers, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { IconBrandGoogle } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { useRegisterMutation } from "@/services/authService";
import { UserLogin } from "@/app/types/user";
import { CustomError } from "@/app/types/error";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/notify";

interface SignupFormValues {
  company: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupForm() {
  const [register, { data, error, isLoading }] = useRegisterMutation();

  const router = useRouter();

  const validationSchema = yup.object({
    company: yup.string().required("Champ requis"),
    email: yup.string().email("Email invalide").required("Champ requis"),
    password: yup.string().required("Champ requis"),
    confirmPassword: yup.string().required("Champ requis").oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas"),
  });

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      company: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(
    values: SignupFormValues,
    { setSubmitting, setErrors }: FormikHelpers<SignupFormValues>
  ) {
    const { confirmPassword, ...user } = values;
    try {
      await register(user as UserLogin).unwrap();
      notify("Envoyé! en attente de vérification", { icon: "✅", style: { background: "#fff", color: "#000" } });
      router.push(`register-verification?email=${values.email}`);
    } catch (err: any) {
      notify((err as CustomError).data || "Une erreur s'est produite.", { icon: "❌", style: { background: "#fff", color: "#000" } });
    } finally {
      setSubmitting(false);
    }
  }

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
      <FormikProvider value={formik}>
        <Form className="mt-8">
          <LabelInputContainer className="mb-4">
            <div className="flex justify-between w-full items-center">
              <Label htmlFor="company">Entreprise</Label>
              {formik.errors.company && formik.touched.company ? (
                <span className="text-red-500 text-sm">{formik.errors.company}</span>
              ) : null}
            </div>
            <Input
              id="company"
              placeholder="Turnadon"
              type="text"
              name="company"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.company}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <div className="flex justify-between w-full items-center">
              <Label htmlFor="email">Email</Label>
              {formik.errors.email && formik.touched.email ? (
                <span className="text-red-500 text-sm">{formik.errors.email}</span>
              ) : null}
            </div>
            <Input
              id="email"
              placeholder="exemple@mail.com"
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <div className="flex justify-between w-full items-center">
              <Label htmlFor="password">Mot de passe</Label>
              {formik.errors.password && formik.touched.password ? (
                <span className="text-red-500 text-sm">{formik.errors.password}</span>
              ) : null}
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <div className="flex justify-between w-full items-center">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                <span className="text-red-500 text-sm">{formik.errors.confirmPassword}</span>
              ) : null}
            </div>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
          </LabelInputContainer>

          <button
            className="cursor-pointer bg-gradient-to-br relative group/btn animate-shimmer from-[#7A63EB] dark:from-zinc-900 dark:to-zinc-900 to-[#5C9BEB] block dark:bg-zinc-800 w-full text-white rounded-full h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Inscription &rarr;
            <BottomGradient />
          </button>
          <Toaster />

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            {/* <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Google
              </span>
              <BottomGradient />
            </button> */}
          </div>
        </Form>
      </FormikProvider>
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