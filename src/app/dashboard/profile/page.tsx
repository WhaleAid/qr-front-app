"use client";

import UpdateNameForm from "@/components/UpdateNameForm";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";
import ProfilePic from "@/components/profilePic";
import { useGetMeQuery } from "@/services/userService";

// update profile page
export default function Profile() {

    const { data: me, error: meError, isLoading: meIsLoading } = useGetMeQuery();

    return (
        <div className="p-8 lg:pt-8 pt-12 overflow-y-scroll w-full">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl text-black my-4 w-full">Profil</h1>
            </div>
            <div className="flex flex-wrap gap-6 p-6 bg-white rounded-lg">
                <div className="w-full flex gap-4 items-center">
                    {
                        me ? (
                            <ProfilePic client={me} />
                        ) : (
                            <div className="w-full m-auto flex justify-center flex-col items-center gap-4">
                                <span className='text-black font-bold text-xl drop-shadow-md'>
                                    Chargement...
                                </span>
                            </div>
                        )
                    }
                    <div className="flex flex-col gap-2">
                        <span className="text-xl font-bold text-black">{me?.company}</span>
                        <span className="text-lg text-gray-500">{me?.email}</span>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex flex-col gap-6">
                <h2 className="font-bold text-xl text-black">Modifier votre profil</h2>
                <div className="flex gap-6 w-full justify-between lg:flex-row flex-col">
                    <div className="bg-white rounded-lg py-6 lg:px-10 px-2 w-full">
                        <h2 className="mb-4 text-black font-bold text-xl">Change le nom de l'entreprise</h2>
                        <UpdateNameForm />
                    </div>
                    <div className="bg-white rounded-lg py-6 lg:px-10 px-2 w-full">
                        <h2 className="mb-4 text-black font-bold text-xl">Changer le mot de passe</h2>
                        <UpdatePasswordForm />
                    </div>
                </div>
            </div>
        </div>
    );
}