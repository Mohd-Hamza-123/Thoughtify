import profile from "@/appwrite/profile";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import appwriteService from "@/appwrite/config";


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

export const getUserByName = async (name) => {
    try {
        const userProfile = await profile.listProfile({ name });
        return userProfile?.documents || null
    } catch (error) {
        return null
    }
}

export const followUnfollow = async ({ isFollow, slug, myProfile }) => {
    try {

        let following = [...myProfile.following]
        if (isFollow) {
            const userProfile = await profile.listSingleProfile(slug);
            let followers = userProfile?.followers
            followers = followers?.filter((follower) => JSON.parse(follower).profileID !== myProfile.$id)
            await profile.updateEveryProfileAttribute({ profileID: slug, followers })
            following = following.filter((follow) => JSON.parse(follow).profileID !== slug)
            const updateProfile = await profile.updateEveryProfileAttribute({ profileID: myProfile.$id, following })
            if (updateProfile) return {
                success: true,
                payload: updateProfile
            }
        } else {

            const userProfile = await profile.listSingleProfile(slug)
            let followers = userProfile?.followers
            const newFollower = JSON.stringify({ profileID: myProfile.$id, name: myProfile.name })
            followers.push(newFollower)
            await profile.updateEveryProfileAttribute({ profileID: slug, followers })
            const { name, $id } = userProfile

            const followingObject = JSON.stringify({ profileID: $id, name })
            following.push(followingObject)

            const updateProfile = await profile.updateEveryProfileAttribute({ profileID: myProfile.$id, following })

            if (updateProfile) return {
                success: true,
                payload: updateProfile
            }
        }

    } catch (error) {
        return {
            success: false,
            error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
        }
    }
}
export const blockUnblock = async ({ isBlocked, slug, myProfile }) => {
   
    try {
        let blockedUsers = [...myProfile.blockedUsers]
        if (isBlocked) {
            blockedUsers = blockedUsers.filter((user) => user !== slug)
            const updateProfile = await profile.updateEveryProfileAttribute({ profileID: myProfile.$id, blockedUsers })
            if (updateProfile) return {
                success: true,
                payload: updateProfile
            }
        } else {
            blockedUsers.push(slug)
            const updateProfile = await profile.updateEveryProfileAttribute({ profileID: myProfile.$id, blockedUsers })
            if (updateProfile) return {
                success: true,
                payload: updateProfile
            }
        }
    } catch (error) {
        return {
            success: false,
            error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
        }
    }
}

