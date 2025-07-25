import profile from '@/appwrite/profile'
import avatarService from '@/appwrite/avatar'

const useProfile = () => {

    const createProfile = async (payload) => {
        const { userId, name } = payload
        try {
            const profileImageURL = avatarService.createAvatar({ name })
            const profileImageId = null
            const profileImage = { profileImageId, profileImageURL }
            const response = await profile.createProfile({
                name,
                userId,
                profileImage: JSON.stringify(profileImage)
            })
            return response
        } catch (error) {
            console.log(error)
            throw new Error("Error creating profile")
        }
    }

    return { createProfile }
}

export default useProfile