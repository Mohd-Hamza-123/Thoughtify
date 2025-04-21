import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";

export function useGetProfileData() {

    const dispatch = useDispatch();

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
        return null
    }
    return { getProfileData, getProfileImageURLFromID }
}

