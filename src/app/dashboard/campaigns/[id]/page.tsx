"use client";
import { Campaign } from "@/app/types/campaign";
import { Generation } from "@/app/types/generation";
import { Image } from "@/app/types/image";
import { Meteors } from "@/components/ui/meteors";
import NoData from "@/components/ui/no-data";
import { useGetCampaignByIdQuery } from "@/services/campaignService";
import { useGetGenerationsByCampaignIdQuery, useGetNotVotedGenerationsByCampaignIdQuery, useRemoveVoteMutation, useVoteGenerationMutation } from "@/services/generationService";
import { useGetNotVotedImagesByCampaignIdQuery, useVoteImageMutation } from "@/services/imageService";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Vortex } from "react-loader-spinner";

export default function CampaignComponent() {
    const { id } = useParams<{ id: string }>();

    const searchParams = useSearchParams()
    const campaignName = searchParams.get('name')

    const { data: generations, error: generationsError, isLoading: generationsLoading, refetch } = useGetNotVotedGenerationsByCampaignIdQuery(id);
    const { data: images, error: imagesError, isLoading: imagesLoading } = useGetNotVotedImagesByCampaignIdQuery(id);
    const [voteGeneration] = useVoteGenerationMutation();
    const [voteImage] = useVoteImageMutation();
    const [removeVote] = useRemoveVoteMutation();
    const [currentGenerations, setCurrentGenerations] = useState<Generation[]>([]);
    const [currentImages, setCurrentImages] = useState<Image[]>([]);
    const [currentView, setCurrentView] = useState<'text' | 'images'>('text');

    useEffect(() => {
        if (generations) {
            setCurrentGenerations(generations);
        }
        if (images) {
            setCurrentImages(images);
        }
    }, [generations, images]);

    const handleGenerationVote = async (generationId: string, vote: boolean) => {
        await voteGeneration({ generationId, vote });
        setCurrentGenerations((prev) => prev.filter((gen) => gen._id !== generationId));
        refetch();
    };
    const handleImageVote = async (imageId: string, vote: boolean) => {
        await voteImage({ imageId, vote });
        setCurrentImages((prev) => prev.filter((img) => img._id !== imageId));
        refetch();
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="p-8 lg:pt-8 pt-14 w-full h-full flex flex-col">
                <h1 className="font-bold text-2xl text-black lg:pt-0 pt-4">
                    {
                        campaignName
                    }
                </h1>
                <label htmlFor="switcher" className="flex justify-center cursor-pointer mt-4">
                    <div className="relative flex justify-between w-full max-w-md h-10 bg-white rounded-full box-content border-8 border-white shadow-sm">
                        <input
                            id="switcher"
                            type="checkbox"
                            className="hidden peer"
                            onChange={() => setCurrentView(currentView === "text" ? "images" : "text")}
                            checked={currentView === "images"}
                        />
                        <span className={`text-center flex-grow relative z-20 self-center transition ${currentView === "text" ? 'text-white' : 'text-black'} peer-checked:text-black`}>
                            Texte
                        </span>
                        <span className={`text-center flex-grow relative z-20 self-center transition ${currentView === "images" ? 'text-white' : 'text-black'} peer-checked:text-white`}>
                            Images
                        </span>
                        <span className={`absolute z-10 bg-primary h-10 w-1/2 rounded-full transition-all top-0 ${currentView === "images" ? 'left-1/2' : 'left-0'}`}></span>
                    </div>
                </label>
                {generationsLoading && imagesLoading ? (
                    <div className="w-full h-full m-auto flex justify-center flex-col items-center gap-4">
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
                ) : generationsError && imagesError ? (
                    <div>Erreur lors du chargement du contenu</div>
                ) : (
                    <>
                        <div className="relative m-auto lg:w-1/2 w-full justify-center items-center flex">
                            {
                                currentView === "images" ? (
                                    currentImages.length === 0 ? (
                                        <div className="flex flex-col justify-center items-center gap-4">
                                            <NoData />
                                            <span className="text-black font-semibold text-lg text-center w-full">
                                                Aucune image à afficher
                                            </span>
                                        </div>
                                    ) : (
                                        currentImages.map((image: Image, index) => (
                                            <AnimatePresence mode="sync">
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="absolute rounded-2xl" key={image._id} style={{ zIndex: currentImages.length - index }}>
                                                    <div className="w-fit relative">
                                                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary to-secondary transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                                                        <div className="relative xl:w-3/5 lg:w-3/5 md:w-3/5 sm:w-4/5 w-full m-auto shadow-xl bg-gray-200 border border-gray-100 px-4 py-4 h-full overflow-hidden rounded-2xl flex flex-col justify-center items-center">
                                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mb-4 self-start">
                                                                <img src="/assets/imgs/turnadon-logo.png" alt="" />
                                                            </div>
                                                            <img src={image.image} alt="image" className="w-full aspect-square object-cover rounded-2xl z-10"/>
                                                            <Meteors number={20} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        ))
                                    )
                                ) : (
                                    currentGenerations.length === 0 ? (
                                        <div className="flex flex-col justify-center items-center gap-4">
                                            <NoData />
                                            <span className="text-black font-semibold text-lg text-center w-full">
                                                Aucun texte à afficher
                                            </span>
                                        </div>
                                    ) : (
                                        currentGenerations.map((generation: Generation, index) => (
                                            <AnimatePresence mode="sync">
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="absolute bg-white rounded-2xl w-full" key={generation._id} style={{ zIndex: currentGenerations.length - index }}>
                                                    <div className="w-full relative">
                                                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary to-secondary transform scale-[0.80] rounded-full blur-3xl" />
                                                        <div className="relative w-full shadow-xl bg-gray-200 border border-gray-100 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col">
                                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mb-4 self-start">
                                                                <img src="/assets/imgs/turnadon-logo.png" alt="" />
                                                            </div>
                                                            <p className="font-normal text-center text-base text-black mb-4 relative">
                                                                {generation.text}
                                                            </p>
                                                            <Meteors number={20} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        ))
                                    )
                                )
                            }
                        </div>
                        {
                            currentView === "images" ? (
                                currentImages.length > 0 && (
                                    <div className="flex w-full">
                                        <div className="flex w-full m-auto justify-center gap-20">
                                            <div className="bg-white flex rounded-full shadow-md p-4 w-18 h-18 cursor-pointer hover:bg-slate-200 transition-all"
                                                onClick={() => currentImages.length > 0 && handleImageVote(currentImages[0]._id, false)}>
                                                <div className="w-12 h-12 m-auto flex">
                                                    <FontAwesomeIcon icon={faTimes} className="text-red-500 m-auto text-3xl" />
                                                </div>
                                            </div>
                                            <div className="bg-white flex rounded-full shadow-md p-4 w-18 h-18 cursor-pointer hover:bg-slate-200 transition-all"
                                                onClick={() => currentImages.length > 0 && handleImageVote(currentImages[0]._id, true)}>
                                                <div className="w-12 h-12 m-auto flex">
                                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 m-auto text-3xl" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                currentGenerations.length > 0 && (
                                    <div className="flex w-full">
                                        <div className="flex w-full m-auto justify-center gap-20">
                                            <div className="bg-white flex rounded-full shadow-md p-4 w-18 h-18 cursor-pointer hover:bg-slate-200 transition-all"
                                                onClick={() => currentGenerations.length > 0 && handleGenerationVote(currentGenerations[0]._id, false)}>
                                                <div className="w-12 h-12 m-auto flex">
                                                    <FontAwesomeIcon icon={faTimes} className="text-red-500 m-auto text-3xl" />
                                                </div>
                                            </div>
                                            <div className="bg-white flex rounded-full shadow-md p-4 w-18 h-18 cursor-pointer hover:bg-slate-200 transition-all"
                                                onClick={() => currentGenerations.length > 0 && handleGenerationVote(currentGenerations[0]._id, true)}>
                                                <div className="w-12 h-12 m-auto flex">
                                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 m-auto text-3xl" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </>
                )}
            </div>
        </Suspense>
    );
}