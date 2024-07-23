import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

interface AvatarProps {
    image?: string;
    company: string;
    email: string;
    onclick?: () => void;
}

const Avatar: FC<AvatarProps> = (
    { image, company, email, onclick }: AvatarProps
) => {
    return (
        <div className="flex items-center w-full justify-start gap-3 py-2 px-3 border border-[#e3e3e3] bg-white rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
            onClick={
                () => {
                    if (onclick) {
                        onclick();
                    }
                }

            }>
            {
                image ?
                    <img src={image} alt="avatar" className="w-14 h-14 rounded-2xl" />
                    : (
                        <div className="w-full bg-primaryLight rounded-2xl p-3 flex">
                            <FontAwesomeIcon icon={faUser} className="w-6 h-6 text-primaryDark m-auto" />
                        </div>
                    )
            }
            <div className="xl:flex flex-col hidden">
                <span className="text-md font-bold text-gray-700">{company ?? 'Société'}</span>
                <span className="text-sm text-gray-400">{email ?? ''}</span>
            </div>
        </div>
    );
}

export default Avatar;