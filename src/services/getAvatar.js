import { useAskContext } from "@/context/AskContext";
import { useSelector } from "react-redux";
import avatarService from "@/appwrite/avatar";

export function getAvatar() {
    const userData = useSelector((state) => state.auth?.userData)
    const { myUserProfile } = useAskContext();
    if (myUserProfile?.profileImgURL) return myUserProfile?.profileImgURL

    const avatar = avatarService.createAvatar({ name: userData?.name })
    return avatar.href || "NoProfile.png"
}

