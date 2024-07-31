"use client";

import { CustomError } from "@/app/types/error";
import { GenerationWithScans } from "@/app/types/generation";
import { ImageWithScans } from "@/app/types/image";
import GenerateForm from "@/components/GenerateForm";
import BtnCustom from "@/components/btnCustom/btnCustom";
import { selectIsAdmin } from "@/lib/features/user/userSlice";
import ProgressBar from "@ramonak/react-progress-bar";
import { useGetCampaignByIdQuery } from "@/services/campaignService";
import { useGetGenerationsByCampaignIdQuery, useGetScansByCampaignIdQuery, useModerateGenerationMutation } from "@/services/generationService";
import { useGetImagesByCampaignIdQuery, useModerateImageMutation } from "@/services/imageService";
import { notify } from "@/utils/notify";
import { faCheck, faFilter, faFont, faImage, faQrcode, faTimes, faTornado } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Vortex } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { socket } from "@/socket";
import { CircularProgress, LinearProgress, linearProgressClasses, styled } from "@mui/material";
import { Scan } from "@/app/types/scan";

export default function ManageCampaigns() {
    const { id } = useParams<{ id: string }>();

    const { data: campaignData, error: errorCampaign, isLoading: isLoadingCampaign } = useGetCampaignByIdQuery(id);
    const { data: generationsData, error: errorGenerations, isLoading: isLoadingGenerations } = useGetGenerationsByCampaignIdQuery(id);
    const { data: scansData, error: errorScans, isLoading: isLoadingScans } = useGetScansByCampaignIdQuery(id);
    const { data: imagesData, error: errorImages, isLoading: isLoadingImages } = useGetImagesByCampaignIdQuery(id);
    const [moderateGeneration, { error: GenerationErrorModeration }] = useModerateGenerationMutation();
    const [moderateImage, { error: ImageErrorModeration }] = useModerateImageMutation();
    const [isConnected, setIsConnected] = useState(false);

    const router = useRouter();
    const isAdmin = useSelector(selectIsAdmin);
    const GenerationDialogRef = useRef<HTMLDialogElement>(null);
    const ImageDialogRef = useRef<HTMLDialogElement>(null);
    const [sortedGenerations, setSortedGenerations] = useState<GenerationWithScans[]>([]);
    const [sortedImages, setSortedImages] = useState<ImageWithScans[]>([]);
    const [isModeratedFilterActive, setIsModeratedFilterActive] = useState(false);
    const [selected, setSelected] = useState<"generations" | "images" | "scans">("generations");

    useEffect(() => {
        if (isAdmin !== null && !isAdmin) {
            router.push('/dashboard/campaigns');
        }

        let sortedGenerationsData = generationsData?.slice().sort((a, b) => {
            if (b.scanCount !== a.scanCount) {
                return b.scanCount - a.scanCount;
            }

            if (a.text && b.text) {
                return a.text.localeCompare(b.text);
            }

            return a.text ? -1 : 1;
        });

        const sortedImagesData = imagesData?.slice().sort((a, b) => {
            if (b.createdAt && a.createdAt) {
                return b.createdAt.localeCompare(a.createdAt);
            }
            return 0;
        });

        setSortedImages(sortedImagesData || imagesData || []);

        if (isModeratedFilterActive) {
            sortedGenerationsData = sortedGenerationsData?.sort((a, b) => {
                if (a.isModerated === b.isModerated) {
                    return 0;
                }
                if (a.isModerated === true) {
                    return -1;
                }
                return 1;
            });
        }

        setSortedGenerations(sortedGenerationsData || []);

    }, [isAdmin, generationsData, isModeratedFilterActive, imagesData]);

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(true);
        };

        const onDisconnect = () => {
            setIsConnected(false);
        };

        if (socket.connected) {
            onConnect();
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("progress", (data: ImageWithScans[]) => {
            const dataMap = new Map<string, ImageWithScans>(data.map(item => [item._id, item]));

            setSortedImages((prevImages) =>
                prevImages.map((image) => {
                    const imageData = dataMap.get(image._id);
                    if (imageData) {
                        return {
                            ...image,
                            progress: imageData.progress,
                            status: imageData.status,
                            image: imageData.image,
                        };
                    }
                    return image;
                })
            );
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("progress");
        };
    }, [sortedImages]);

    const handleFilterClick = () => {
        setIsModeratedFilterActive((prevState) => !prevState);
    };

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        width: 100,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));

    return (
        <div className="lg:p-8 p-4 lg:pt-8 pt-12 w-full overflow-y-auto flex flex-col relative">
            <div className="flex w-full justify-between">
                <h1 className="font-bold text-2xl text-black my-4 w-full">
                    Gérer la campagne
                    <span className="text-primary">
                        {' '}
                        {campaignData?.name}
                    </span>
                </h1>
                <div className="h-4 relative flex gap-3 items-center">
                    <div className={`rounded-full w-2 h-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                    </div>
                    <BtnCustom text="+ Générer" colorScheme="light" classname="!w-fit" onclick={() =>
                        selected === "generations" ? GenerationDialogRef.current?.showModal() : ImageDialogRef.current?.showModal()
                    } />
                </div>
            </div>
            {
                isAdmin === null ? (
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
                ) : isAdmin ? (
                    <div>
                        <div className="flex gap-6 justify-between w-full mb-4">
                            <button className={`flex gap-2 justify-center items-center border border-gray-300 rounded-lg lg:p-4 p-2 w-1/2 transition-all text-white ${selected === "generations" ? 'bg-primary' : 'bg-primaryLight'}`}
                                onClick={() => setSelected("generations")}>
                                <FontAwesomeIcon icon={faFont} className="w-6 h-6" />
                                <span className="lg:flex hidden">
                                    Générations
                                </span>
                            </button>
                            <button className={`flex gap-2 justify-center items-center border border-gray-300 rounded-lg lg:p-4 p-2 w-1/2 transition-all text-white ${selected === "images" ? 'bg-primary' : 'bg-primaryLight'}`}
                                onClick={() => setSelected("images")}>
                                <FontAwesomeIcon icon={faImage} className="w-6 h-6" />
                                <span className="lg:flex hidden">
                                    Images
                                </span>
                            </button>
                            <button className={`flex gap-2 justify-center items-center border border-gray-300 rounded-lg lg:p-4 p-2 w-1/2 transition-all text-white ${selected === "images" ? 'bg-primary' : 'bg-primaryLight'}`}
                                onClick={() => setSelected("scans")}>
                                <FontAwesomeIcon icon={faQrcode} className="w-6 h-6" />
                                <span className="lg:flex hidden">
                                    Scans
                                </span>
                            </button>
                        </div>
                        {
                            selected === "generations" ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-black text-center w-full">
                                        <div className="">
                                            {
                                                isLoadingCampaign && isLoadingGenerations ? (
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
                                                ) : errorCampaign || errorGenerations ? (
                                                    <div className="text-black text-center w-full">
                                                        <span>
                                                            Erreur lors du chargement de la campagne
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-6 bg-white rounded-lg p-4">
                                                        <div className="flex flex-col gap-6">
                                                            {
                                                                sortedGenerations?.length === 0 ? (
                                                                    <div className="w-full m-auto flex justify-center flex-col items-center gap-4">
                                                                        <span className='text-black font-bold text-xl drop-shadow-md'>
                                                                            Aucune génération disponible
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex w-full justify-end">
                                                                            <FontAwesomeIcon
                                                                                icon={faFilter}
                                                                                className="w-6 h-6 cursor-pointer hover:text-primary transition-all"
                                                                                onClick={handleFilterClick}
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col gap-6 w-full">
                                                                            {
                                                                                sortedGenerations?.map((generation: GenerationWithScans) => (
                                                                                    <div key={generation._id} className={`flex lg:gap-6 gap-2 lg:justify-between justify-center rounded-lg pl-4 lg:py-2 py-4 items-center w-full border-l-8 transition-all lg:flex-row flex-col 
                                                    ${generation.isModerated === true ? 'border-green-500' : generation.isModerated === false ? 'border-red-500' : 'border-gray-300'}`}>
                                                                                        <span className="text-black lg:text-lg text-xs">
                                                                                            {
                                                                                                generation.text
                                                                                            }
                                                                                        </span>
                                                                                        <div className="flex gap-6 flex-wrap">
                                                                                            <div className="flex flex-row-reverse gap-2 justify-center items-center">
                                                                                                <FontAwesomeIcon icon={faQrcode} className="w-6 h-6" />
                                                                                                <span>
                                                                                                    {
                                                                                                        generation.scanCount
                                                                                                    }{' '}
                                                                                                    <span className="lg:flex hidden">
                                                                                                        Scans
                                                                                                    </span>
                                                                                                </span>
                                                                                            </div>
                                                                                            <button className="flex items-center gap-2 bg-secondary hover:bg-secondaryDark transition-all text-white lg:w-12 lg:h-12 w-8 h-8 rounded-full"
                                                                                                onClick={() => {
                                                                                                    try {
                                                                                                        moderateGeneration({ generationId: generation._id, approved: true });
                                                                                                        notify('Génération approuvée', { icon: '✅', style: { background: '#fff', color: '#000' } });
                                                                                                    } catch (err) {
                                                                                                        notify((err as CustomError).data || "Une erreur s'est produite.", { icon: "❌", style: { background: "#fff", color: "#000" } });
                                                                                                    }
                                                                                                }}>
                                                                                                <span className="m-auto">
                                                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                                                </span>
                                                                                            </button>
                                                                                            <button className="flex items-center gap-2 bg-secondary hover:bg-secondaryDark transition-all text-white lg:w-12 lg:h-12 w-8 h-8 rounded-full"
                                                                                                onClick={() => {
                                                                                                    try {
                                                                                                        moderateGeneration({ generationId: generation._id, approved: false });
                                                                                                        notify('Génération rejetée', { icon: '✅', style: { background: '#fff', color: '#000' } });
                                                                                                    } catch (err) {
                                                                                                        notify((err as CustomError).data || "Une erreur s'est produite.", { icon: "❌", style: { background: "#fff", color: "#000" } });
                                                                                                    }
                                                                                                }}>
                                                                                                <span className="m-auto">
                                                                                                    <FontAwesomeIcon icon={faTimes} />
                                                                                                </span>
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <dialog className="text-black text-center lg:w-1/2 w-4/5 rounded-lg pb-10" ref={GenerationDialogRef}>
                                            <div className="flex flex-col justify-end w-full items-center">
                                                <button className="flex text-white w-6 h-6 bg-red-500 rounded-full m-4 self-end" onClick={() => GenerationDialogRef.current?.close()}>
                                                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 m-auto" />
                                                </button>
                                                <GenerateForm type="completion" onSubmitSuccess={
                                                    () => {
                                                        GenerationDialogRef.current?.close();
                                                    }
                                                } />
                                            </div>
                                        </dialog>
                                    </motion.div>
                                </AnimatePresence>
                            ) : selected === "images" ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        transition={{ duration: 0.2 }}
                                        key="images"
                                        className="text-black text-center w-full">
                                        <div>
                                            {
                                                isLoadingCampaign && isLoadingImages ? (
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
                                                ) : errorCampaign || errorImages ? (
                                                    <div className="text-black text-center w-full">
                                                        <span>
                                                            Erreur lors du chargement des images
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-6 bg-white rounded-lg p-4">
                                                        {
                                                            sortedImages && sortedImages.length > 0 ? (
                                                                <>
                                                                    <div className="flex flex-col gap-6 w-full">
                                                                        {
                                                                            sortedImages?.map((image) => (
                                                                                <div key={image._id} className={`flex lg:gap-6 gap-2 lg:justify-between justify-center rounded-lg pl-4 lg:py-2 py-4 items-center w-full border-l-8 transition-all lg:flex-row flex-col
                                                                            ${image.isModerated === true ? 'border-green-500' : image.isModerated === false ? 'border-red-500' : 'border-gray-300'}`}>
                                                                                    <span className="text-black w-60 h-60 flex">
                                                                                        {
                                                                                            !image.image ? (
                                                                                                <CircularProgress color="secondary" className="m-auto" />
                                                                                            ) : (
                                                                                                <img src={image.image} alt="" className="w-full h-full object-cover" />
                                                                                            )
                                                                                        }
                                                                                    </span>
                                                                                    <span className="text-green-500 lg:ml-4">
                                                                                        {
                                                                                            image.status === "done" || image.image ? (
                                                                                                <span className="flex items-center gap-3 text-green-500">
                                                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                                                    Terminé
                                                                                                </span>
                                                                                            ) : image.status === "error" ? (
                                                                                                <span className="flex items-center gap-3 text-red-500">
                                                                                                    <FontAwesomeIcon icon={faTimes} />
                                                                                                    Échoué
                                                                                                </span>
                                                                                            ) : image.progress ? (
                                                                                                <BorderLinearProgress variant="determinate" value={image.progress} />

                                                                                            ) : (
                                                                                                <span className="flex items-center gap-3 text-blue-500">
                                                                                                    <FontAwesomeIcon icon={faTornado} />
                                                                                                    En cours
                                                                                                </span>
                                                                                            )
                                                                                        }
                                                                                    </span>
                                                                                    <div className="flex gap-6 lg:ml-4 flex-wrap">
                                                                                        <div className="flex flex-row-reverse gap-2 justify-center items-center text-black">
                                                                                            <FontAwesomeIcon icon={faQrcode} className="w-6 h-6" />
                                                                                            <span>
                                                                                                {
                                                                                                    image.scanCount
                                                                                                }{' '}
                                                                                                <span className="lg:flex hidden">
                                                                                                    Scans
                                                                                                </span>
                                                                                            </span>
                                                                                        </div>
                                                                                        <button className="flex items-center gap-2 bg-secondary hover:bg-secondaryDark transition-all text-white lg:w-12 lg:h-12 w-8 h-8 rounded-full"
                                                                                            disabled={
                                                                                                !image.image ? true : false
                                                                                            }
                                                                                            onClick={() => {
                                                                                                try {
                                                                                                    moderateImage({ imageId: image._id, approved: true });
                                                                                                    notify('Image approuvée', { icon: '✅', style: { background: '#fff', color: '#000' } });
                                                                                                } catch (err) {
                                                                                                    notify((err as CustomError).data || "Une erreur s'est produite.", { icon: "❌", style: { background: "#fff", color: "#000" } });
                                                                                                }
                                                                                            }}>
                                                                                            <span className="m-auto">
                                                                                                <FontAwesomeIcon icon={faCheck} />
                                                                                            </span>
                                                                                        </button>
                                                                                        <button className="flex items-center gap-2 bg-secondary hover:bg-secondaryDark transition-all text-white lg:w-12 lg:h-12 w-8 h-8 rounded-full"
                                                                                            disabled={
                                                                                                !image.image ? true : false
                                                                                            }
                                                                                            onClick={() => {
                                                                                                try {
                                                                                                    moderateImage({ imageId: image._id, approved: false });
                                                                                                    notify('Image rejetée', { icon: '✅', style: { background: '#fff', color: '#000' } });
                                                                                                } catch (err) {
                                                                                                    notify((err as CustomError).data || "Une erreur s'est produite.", { icon: "❌", style: { background: "#fff", color: "#000" } });
                                                                                                }
                                                                                            }}>
                                                                                            <span className="m-auto">
                                                                                                <FontAwesomeIcon icon={faTimes} />
                                                                                            </span>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="w-full m-auto flex justify-center flex-col items-center gap-4">
                                                                    <span className='text-black font-bold text-xl drop-shadow-md'>
                                                                        Aucune image disponible
                                                                    </span>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <dialog className="text-black text-center lg:w-1/2 w-4/5 rounded-lg pb-10" ref={ImageDialogRef}>
                                            <div className="flex flex-col justify-end w-full items-center">
                                                <button className="flex text-white w-6 h-6 bg-red-500 rounded-full m-4 self-end" onClick={() => ImageDialogRef.current?.close()}>
                                                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 m-auto" />
                                                </button>
                                                <GenerateForm type="image" onSubmitSuccess={
                                                    () => {
                                                        ImageDialogRef.current?.close();
                                                    }
                                                } />
                                            </div>
                                        </dialog>
                                    </motion.div>
                                </AnimatePresence>
                            ) : selected === "scans" ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-black text-center w-full">
                                        <div className="">
                                            {
                                                isLoadingScans ? (
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
                                                ) : errorCampaign || errorGenerations ? (
                                                    <div className="text-black text-center w-full">
                                                        <span>
                                                            Erreur lors du chargement de la campagne
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-6 bg-white rounded-lg p-4">
                                                        <div className="flex flex-col gap-6">
                                                            {
                                                                scansData?.length === 0 ? (
                                                                    <div className="w-full m-auto flex justify-center flex-col items-center gap-4">
                                                                        <span className='text-black font-bold text-xl drop-shadow-md'>
                                                                            Aucun scan effectué
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex w-full justify-end">
                                                                            {/* <FontAwesomeIcon
                                                                                icon={faFilter}
                                                                                className="w-6 h-6 cursor-pointer hover:text-primary transition-all"
                                                                                onClick={handleFilterClick}
                                                                            /> */}
                                                                        </div>
                                                                        <div className="grid flex-row flex-wrap gap-6 w-full">
                                                                            {
                                                                                scansData?.map((scan: Scan) => (
                                                                                    <div key={scan._id} className={`flex flex-col lg:gap-6 gap-2 lg:justify-between justify-center bg-primaryLight bg-opacity-35 rounded-lg p-4 items-center w-fit transition-all shadow-md`}>
                                                                                        <img className="aspect-square object-cover max-w-52 rounded-lg" src={scan.image.image} alt="" />
                                                                                        <div className="flex justify-between items-center flex-col gap-4">
                                                                                            <span className="text-black lg:text-lg text-xs max-w-60">
                                                                                                {
                                                                                                    scan.generation.text
                                                                                                }
                                                                                            </span>
                                                                                            <div className="flex gap-6 flex-wrap">
                                                                                                <div className="flex flex-row-reverse gap-2 justify-center items-center w-full">
                                                                                                    <span>
                                                                                                        {
                                                                                                            scan.count
                                                                                                        }
                                                                                                    </span>
                                                                                                    <FontAwesomeIcon icon={faQrcode} className="w-6 h-6" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <dialog className="text-black text-center lg:w-1/2 w-4/5 rounded-lg pb-10" ref={GenerationDialogRef}>
                                            <div className="flex flex-col justify-end w-full items-center">
                                                <button className="flex text-white w-6 h-6 bg-red-500 rounded-full m-4 self-end" onClick={() => GenerationDialogRef.current?.close()}>
                                                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 m-auto" />
                                                </button>
                                                <GenerateForm type="completion" onSubmitSuccess={
                                                    () => {
                                                        GenerationDialogRef.current?.close();
                                                    }
                                                } />
                                            </div>
                                        </dialog>
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <></>
                            )
                        }
                    </div>
                ) : (
                    <div className="text-black text-center w-full">
                        <span>
                            Please refresh the page
                        </span>
                    </div>
                )
            }
        </div>
    );
}
