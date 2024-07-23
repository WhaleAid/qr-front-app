"use client"

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { motion } from "framer-motion";

export default function Dashboard() {
    return (
        <div className="p-8 flex w-full">
            <div className="m-auto flex flex-col justify-center items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <img src="/assets/imgs/turnadon-logo.png" alt="Logo turnadon" />
                </motion.div>
                <TextGenerateEffect className="text-6xl text-center font-bold text-gray-800 mt-4"
                    words="Bienvenue chez Turnadon"
                />
            </div>
        </div>
    );
}