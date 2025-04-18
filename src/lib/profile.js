import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
export async function getProfileData() {
    const dispatch = useDispatch();
    try {
        const userProfile = await profile.listProfile({ slug: userData?.$id });
        return userProfile?.documents[0] || null
    } catch (error) {
        dispatch(logout());
        return null
    }
}

