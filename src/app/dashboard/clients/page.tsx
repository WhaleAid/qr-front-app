"use client"

import { User } from "@/app/types/user"
import ProfilePic from "@/components/profilePic"
import { useGetAllQuery } from "@/services/userService"
import { useRouter } from "next/navigation"
import { Vortex } from "react-loader-spinner"

export default function clients() {

    const { data: clients, error: errorClients, isLoading: isLoadingClients } = useGetAllQuery()
    const router = useRouter()

    return (
        <div className="lg:p-8 lg:pt-8 pt-12 p-4 w-full flex flex-col h-full">
            <h1 className="font-bold text-2xl text-black my-4 w-full">Clients</h1>
            {
                isLoadingClients ? (
                    <div className="w-full m-auto flex justify-center flex-col items-center gap-4">
                        <Vortex
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={['#7A63EB', '#5C9BEB', '#7A63EB', '#5C9BEB', '#7A63EB', '#5C9BEB']}
                        />
                        <span className='text-black font-bold text-xl drop-shadow-md'>
                            Chargement...
                        </span>
                    </div>
                ) : errorClients ? (
                    <div className="text-black text-center w-full">
                        <span>
                            Erreur lors du chargement des clients
                        </span>
                    </div>
                ) : clients?.length === 0 ? (
                    <div className="text-black text-center w-full">
                        <span>
                            Aucun client disponible
                        </span>
                    </div>
                ) : (
                    <div className="w-full lg:grid grid-cols-4 flex flex-col">
                        {
                            clients?.map((client: User) => {
                                return (
                                    <div key={client._id} className="flex w-full lg:gap-6 gap-2 lg:flex-col flex-row
                                     lg:justify-between justify-start items-center lg:w-fit rounded-lg bg-white lg:p-6 p-2 cursor-pointer shadow-sm"
                                        onClick={() => {
                                            router.push(`/dashboard/clients/${client._id}`)
                                        }}
                                    >
                                        <div>
                                            <ProfilePic client={client} />
                                        </div>
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-black font-bold text-center lg:text-lg text-sm">{client.company}</p>
                                                <p className="text-gray-600 text-center lg:text-lg text-sm">{client.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}