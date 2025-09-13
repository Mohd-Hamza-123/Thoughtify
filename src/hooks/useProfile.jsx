import profile from '@/appwrite/profile'
import avatarService from '@/appwrite/avatar'
import { useDispatch } from 'react-redux'
import { userProfile } from '@/store/profileSlice'
import { logout } from '@/store/authSlice'

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
            console.log(error)
            throw new Error("Error creating profile")
        }
    }

    return { createProfile }
}

export default useProfile