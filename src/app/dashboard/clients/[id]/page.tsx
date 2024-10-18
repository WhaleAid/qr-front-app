"use client"

import { CampaignWithOwner } from "@/app/types/campaign";
import CampaignForm from "@/components/CampaignForm";
import BtnCustom from "@/components/btnCustom/btnCustom";
import { selectUser } from "@/lib/features/user/userSlice";
import { useGetCampaignsByUserIdQuery } from "@/services/campaignService";
import { daysLeft as daysElapsed } from "@/utils/dateUtils";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Vortex } from "react-loader-spinner";
import { useSelector } from "react-redux";

export default function clientPage() {
    const { id } = useParams<{ id: string }>();
    const { data: campaigns, error: errorCampaigns, isLoading: isLoadingCampaigns } = useGetCampaignsByUserIdQuery(id);

    const router = useRouter();
    const user = useSelector(selectUser)
    const dialogRef = useRef<HTMLDialogElement>(null);
    const isMobile = useMediaQuery('(max-width:1280px)');

    useEffect(() => {
        if (user && user?.role !== 'admin') {
            router.push('/dashboard/campaigns')
        }
    }, [user])

    return (
        <div className="p-3 lg:pt-8 pt-12 overflow-y-auto w-full rounded-lg">
            <dialog className="text-black text-center lg:w-1/4 w-4/5 rounded-lg" ref={dialogRef}>
                <div className="flex justify-end w-full items-center">
                    <button className="flex text-white w-6 h-6 bg-red-500 rounded-full m-4" onClick={() => dialogRef.current?.close()}>
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4 m-auto" />
                    </button>
                </div>
                <CampaignForm onSubmitSuccess={
                    () => {
                        dialogRef.current?.close()
                    }
                } />
            </dialog>
            <div className="flex justify-between items-center lg:flex-row flex-col lg:mb-auto mb-3">
                <h1 className="font-bold text-2xl text-black my-4 w-full">Campagnes</h1>
                <div className="flex lg:w-auto w-full lg:justify-center justify-start items-center gap-4 lg:flex-row flex-row-reverse">
                    <BtnCustom text={isMobile ? '+ Ajouter' : 'Create Campaign'} onclick={() => {
                        dialogRef.current?.showModal()
                    }}
                    colorScheme="violet" />
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-12 h-12 flex bg-primary rounded-full">
                            <span className="m-auto text-white">
                                {
                                    (campaigns?.at(0) as CampaignWithOwner)?.owner.company.charAt(0).toUpperCase()
                                }
                            </span>
                        </div>
                        <p className="text-black lg:flex hidden">
                            {
                                (campaigns?.at(0) as CampaignWithOwner)?.owner.company ?? ''
                            }
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-6 lg:p-6 p-0 overflow-y-scroll">
                {
                    isLoadingCampaigns ? (
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
                    ) : errorCampaigns ? (
                        <div className="text-black text-center w-full">
                            <span>
                                Error while fetching campaigns
                            </span>
                        </div>
                    ) : campaigns?.length === 0 ? (
                        <div className="text-black text-center w-full">
                            <span>
                                No campaigns available
                            </span>
                        </div>
                    ) : (
                        <table className="bg-white rounded-md w-full">
                            <thead>
                                <tr className="text-black border-b border-gray-200">
                                    <th className="p-4 lg:text-md text-sm">Nom</th>
                                    <th className="p-4 lg:text-md text-sm">Description</th>
                                    <th className="p-4 lg:text-md text-sm">Date de création</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns?.map((campaign, index) => (
                                    <tr key={index} className="cursor-pointer hover:bg-gray-100 transition-all border-b border-gray-200"
                                        onClick={() => {
                                            router.push(`/dashboard/campaigns/${campaign._id}/manage`)
                                        }}
                                    >
                                        <td className="p-4">
                                            <h2 className="lg:text-lg text-black font-bold text-center text-sm">{campaign.name}</h2>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-black text-center">{campaign.description}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-500 text-center">
                                                {
                                                    daysElapsed(campaign.createdAt) === 0 ? 'Aujourd\'hui' :
                                                        daysElapsed(campaign.createdAt) === 1 ? 'Hier' :
                                                            `Il y a ${daysElapsed(campaign.createdAt)} jours`
                                                }
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }
            </div>
        </div>
    );
}