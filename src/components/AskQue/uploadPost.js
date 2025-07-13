import conf from "@/conf/conf";
import appwriteService from "@/appwrite/config";
import { currentFormattedDate } from "@/helpers/format-dates";
const uploadPostWithUnsplashAPI = async (initialPostData, data, userData, uploaderProfile) => {

    try {
        const trustedResponderPost = uploaderProfile?.documents[0].trustedResponder
        const formattedDate = currentFormattedDate()

        const {
            categoryValue,
            pollOptions,
            pollQuestion,
        } = initialPostData

        const response = await fetch(`https://api.unsplash.com/search/photos?query=${categoryValue}&per_page=10&client_id=${conf.unsplashApiKey}`)
        if (response.ok) {
            const UnsplashRes = await response.json();
            const ImgArrUnsplash = UnsplashRes.results
            console.log(ImgArrUnsplash)
            const randomIndex = Math.floor(Math.random() * 10);
            const ImgURL = ImgArrUnsplash[randomIndex]?.urls?.raw
            const queImage = JSON.stringify({ imageURL: ImgURL, imageID: null })

            const dbPost = await appwriteService.createPost({
                ...data,
                userId: userData.$id,
                queImage: JSON.stringify(queImage),
                pollQuestion,
                pollOptions,
                name: userData?.name,
                date: formattedDate,
                trustedResponderPost
            }, categoryValue);
            return dbPost
        }

        return null
    } catch (error) {
        console.log(error)
        return null
    }

}


export default uploadPostWithUnsplashAPI