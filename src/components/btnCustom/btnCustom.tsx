"use client";

import { FC } from "react";

interface buttonProps {
    text: string;
    colorScheme?: 'light' | 'violet';
    onclick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    classname?: string;
}

const BtnCustom: FC<buttonProps> = ({
    text,
    colorScheme,
    onclick,
    classname,
    type,
    disabled,
    ...rest
}: buttonProps) => {
    return (
        <button
            className={`w-full rounded-full transition-all h-fit whitespace-nowrap ${colorScheme === 'light' ?
                "bg-white hover:bg-gray-100 text-primary font-semibold py-2 px-4 border border-gray-300 shadow" :
                colorScheme === 'violet' ?
                    "bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4" :
                    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                } ${classname ?? classname}`}
            onClick={onclick}
            type={type}
            disabled={disabled}
            {...rest}
        >
            {text}
        </button>

    )
}

export default BtnCustom