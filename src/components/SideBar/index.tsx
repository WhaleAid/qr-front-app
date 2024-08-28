"use client";

import { FC, useEffect, useState } from "react";
import Avatar from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBusinessTime, faContactCard, faHistory, faRightFromBracket, faUsers, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useLogoutMutation } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Vortex } from "react-loader-spinner";
import { User } from "@/app/types/user";
import { useGetMeQuery } from "@/services/userService";
import { useAppDispatch } from "@/lib/hooks";
import { clearUser } from "@/lib/features/user/userSlice";
import { useMediaQuery } from "@mui/material";

interface SideBarProps { }

const SideBar: FC<SideBarProps> = () => {
    const [logout, { isLoading }] = useLogoutMutation();
    const { data: userData, error: userError, isLoading: userLoading } = useGetMeQuery();
    const isMobile = useMediaQuery('(max-width:1280px)');
    const [showMenu, setShowMenu] = useState<boolean>(!isMobile);

    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <>
            <div
                className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md transition-all ${showMenu ? 'flex opacity-100 z-30' : 'opacity-0 w-0 z-0 pointer-events-none'
                    } xl:hidden`}
                onClick={() => {
                    isMobile && setShowMenu(false);
                }}
            >
                <FontAwesomeIcon
                    icon={faXmark}
                    className="w-6 h-6 text-white absolute top-8 right-8 cursor-pointer"
                />
            </div>
            <FontAwesomeIcon
                icon={faBars}
                className={`w-6 h-6 text-black absolute top-4 left-4 cursor-pointer z-50 p-2 rounded-full bg-primaryLight bg-opacity-50 backdrop-blur-sm shadow-md border-white border ${showMenu ? 'hidden' : 'flex'} xl:hidden`}
                onClick={() => setShowMenu(true)}
            />
            <div
                className={`h-full w-full xl:max-w-xs rounded-l-xl shadow-md bg-white xl:flex ${showMenu ? 'flex translate-x-0 opacity-100 z-50' : '-translate-x-10 opacity-0 w-0 z-0 absolute pointer-events-none'
                    } flex-col py-3 px-4 transition-all`}
            >
                <div className="flex h-full flex-col justify-between">
                    <div className="flex flex-col">
                        <div className="flex self-center mb-6" onClick={() => {
                            router.push("/dashboard")
                            isMobile && setShowMenu(false)
                        }}>
                            <img src="/assets/imgs/turnadon-logo.png" alt="logo" className="w-20 h-20" />
                        </div>
                        {userLoading ? (
                            <div className="flex justify-center items-center">
                                <Vortex
                                    visible={true}
                                    height="60"
                                    width="60"
                                    ariaLabel="vortex-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="vortex-wrapper"
                                    colors={['#7A63EB', '#5C9BEB', '#7A63EB', '#5C9BEB', '#7A63EB', '#5C9BEB']}
                                />
                            </div>
                        ) : (
                            <Avatar
                                company={(userData as User).company ?? ""}
                                email={(userData as User).email ?? ""}
                                onclick={() => {
                                    router.push("/dashboard/profile");
                                    isMobile && setShowMenu(false);
                                }}
                            />
                        )}
                        <ul className="flex w-full flex-col justify-between mt-8">
                            {!userLoading && userData?.role === 'admin' && (
                                <li
                                    className="flex items-center md:justify-start justify-center gap-6 py-4 px-4 my-2 rounded-xl w-full cursor-pointer text-black hover:bg-primary hover:text-white transition-all"
                                    onClick={() => {
                                        router.push("/dashboard/clients")
                                        isMobile && setShowMenu(false)
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6 mb-1" />
                                    <a href="#" className="text-md font-bold md:block hidden">
                                        Clients
                                    </a>
                                </li>
                            )}
                            {userData?.role !== 'admin' && (
                                <>
                                    <li
                                        className="flex items-center md:justify-start justify-center gap-6 py-4 px-4 my-2 rounded-xl w-full cursor-pointer text-black hover:bg-primary hover:text-white transition-all"
                                        onClick={() => {
                                            router.push("/dashboard/campaigns")
                                            isMobile && setShowMenu(false)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faBusinessTime} className="w-6 h-6 mb-1" />
                                        <a href="#" className="text-md font-bold md:block hidden">
                                            Campaigns
                                        </a>
                                    </li>
                                    <li
                                        className="flex items-center md:justify-start justify-center gap-6 py-4 px-4 my-2 rounded-xl w-full cursor-pointer text-black hover:bg-primary hover:text-white transition-all"
                                        onClick={() => {
                                            router.push('/dashboard/historique')
                                            isMobile && setShowMenu(false)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faHistory} className="w-6 h-6 mb-1" />
                                        <a href="#" className="text-md font-bold md:block hidden">
                                            Historique
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div className="mb-2">
                        <button
                            className="shadow-[0_4px_14px_0_rgba(255,0,0,39%)] hover:shadow-[0_6px_20px_rgba(255,0,0,23%)] hover:bg-[rgba(255,0,0,0.9)] px-8 py-2 bg-[#f30000] rounded-md text-white font-light transition duration-200 ease-linear flex justify-center gap-2 items-center m-auto"
                            onClick={() => {
                                dispatch(clearUser());
                                logout();
                                router.push("/authentication");
                            }}
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
                            <span className="xl:block hidden">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;