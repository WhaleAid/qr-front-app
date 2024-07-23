import toast from "react-hot-toast";

export const notify = (message: string, theme: any) => {
    toast(message, { ...theme, position: "top-right", duration: 4000 });
};