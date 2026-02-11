import profile from '@/appwrite/profile'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/authSlice'
import avatarService from '@/appwrite/avatar'
import { userProfile } from '@/store/profileSlice'

const useProfile = () => {

    const dispatch = useDispatch()

    const createProfile = async ({ userId, name }) => {
        try {
            const profileImageURL = avatarService.createAvatar({ name })
            const profileImageId = null
            const profileImage = { profileImageId, profileImageURL }
            const response = await profile.createProfile({
                name,
                userId,
                profileImage: JSON.stringify(profileImage)
            })
            dispatch(userProfile({ userProfile: { ...response } }))
            return response
        } catch (error) {
            dispatch(logout())
            const errMessage = error instanceof Error ? error.message : error
            console.log("Error in createProfile : ", errMessage)
            throw new Error("Error creating profile")
        }
    }

    return { createProfile }
}

export default useProfile