"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function registerValidation() {

    const searchParams = useSearchParams()
    const email = searchParams.get('email') || "email"
    const [seconds, setSeconds] = useState(5)
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push("/authentication")
        }, 5000)
    }, [])

    setInterval(() => {
        if (seconds > 0)
            setSeconds(seconds - 1)
    }, 1000)

    return (
        <div className="flex justify-center items-center w-full h-full relative">
            <div className="w-full absolute top-0 left-0">
                <img src="/assets/imgs/turnadon-logo.png" alt="Turnadon logo" className="w-20 h-20" />
            </div>
            <div className="m-auto flex flex-col gap-4">
                <h1 className="text-black text-4xl font-bold text-center">Veuillez vérifier votre addresse email</h1>
                <div className="flex flex-col gap-14">
                    <span className="text-black text-center text-lg">
                        Un email de vérification a été envoyé vers l'addresse {email}
                    </span>
                    <span className="text-gray-400 text-xl text-center">
                        Vous allez être redirigé vers la page de connexion dans {seconds} secondes
                    </span>
                </div>
            </div>
        </div>
    )
}