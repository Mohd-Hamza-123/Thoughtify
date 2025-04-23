import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import appwriteService from "@/appwrite/config";
import { useSelector } from "react-redux";

export function useGetProfileData() {

    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.auth?.userData);

    async function getProfileData() {
        try {
            const userProfile = await profile.listProfile({ slug: userData?.$id });
            return userProfile?.documents[0] || null
        } catch (error) {
            dispatch(logout());
            return null
        }
    }

    async function getProfileImageURLFromID(profileImageID) {
        // console.log(profileImageID)
        try {
            if (!profileImageID) return null
            
            const res = await appwriteService.getThumbnailPreview(profileImageID)
            return res.href
        } catch (error) {
            return null
        }
    }
    return { getProfileData, getProfileImageURLFromID }
}

