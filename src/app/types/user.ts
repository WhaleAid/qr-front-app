import { FormikErrors } from "formik";

export type UserLogin = {
    company: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export type User = {
    _id: string,
    company: string,
    email: string,
    role: string,
}

export default {
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export interface SignupFormValues {
    company: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface CustomFormikErrors extends FormikErrors<SignupFormValues> {
    submit?: string;
}