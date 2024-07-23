"use client"

import BtnCustom from "@/components/btnCustom/btnCustom";
import { useGetCampaignsQuery } from "@/services/campaignService";
import { useGetMeQuery } from "@/services/userService";
import { daysLeft } from "@/utils/dateUtils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Vortex } from "react-loader-spinner";

export default function Campaigns() {

    const { data: campaigns, error: errorCampaigns, isLoading: isLoadingCampaigns } = useGetCampaignsQuery();

    const { data: userData, error: errorUserInfo, isLoading: isLoadingUserInfo } = useGetMeQuery()

    const router = useRouter();

    useEffect(() => {
        if (!isLoadingUserInfo && userData?.role === 'admin') {
            router.push('/dashboard/campaigns/manage')
        }
    }, [isLoadingUserInfo, userData])

    return (
        <div className="p-8 lg:pt-8 pt-12 overflow-y-scroll w-full">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl text-black my-4 w-full">Campagnes</h1>
            </div>
            <div className="flex flex-wrap gap-6 p-6 lg:px-6 px-0">
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
                        campaigns?.map((campaign, index) => (
                            <div key={index} className="p-4 cursor-pointer bg-white shadow-md rounded-lg flex flex-col justify-between lg:min-h-60 min-h-0 lg:gap-0 gap-4 hover:shadow-lg transition duration-200 ease-in-out w-72"
                                onClick={() => {
                                    router.push(`/dashboard/campaigns/${campaign._id}?name=${encodeURIComponent(campaign.name)}`);
                                }}
                            >
                                <div>
                                    <h2 className="text-lg text-black font-bold">{campaign.name}</h2>
                                    <p className="text-sm text-black">{campaign.description}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {
                                            daysLeft(campaign.createdAt) === 0 ? 'Aujourd\'hui' :
                                                daysLeft(campaign.createdAt) === 1 ? 'Hier' :
                                                    `Il y a ${daysLeft(campaign.createdAt)} jours`
                                        }
                                    </p>
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}