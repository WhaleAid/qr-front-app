import { User } from "@/app/types/user";
import { FC } from "react";

interface ProfilePicProps {
    client: User
}

const ProfilePic: FC<ProfilePicProps> = ({ client }) => {
    return (
        <div className="lg:w-24 lg:h-24 w-12 h-12 flex bg-primary rounded-full">
            {
                // client.profile.image ? (
                //     <img src={client.profile.image} alt="avatar" className="w-full h-full rounded-full" />
                // ) : (
                <div className="m-auto text-white lg:text-3xl text-2xl">
                    {
                        client.company.charAt(0).toUpperCase()
                    }
                </div>
                // )
            }
        </div>
    );
}

export default ProfilePic;