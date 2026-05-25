import { toast } from "sonner"
import profile from "@/appwrite/profile";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "@/appwrite/config";
import { uploadQuestionWithImage, uploadPostWithUnsplashAPI } from "@/lib/posts";


const useSubmitPost = () => {

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAdmin = userData?.labels?.includes("admin") ? true : false;

    const createPost = async ({ initialPostData, data }) => {

        try {

            const uploaderProfile = await profile.getProfileById({ $id: userData?.$id, query: ["name"] });

            let dbPost = null

            if (initialPostData.thumbnailFile) {
                dbPost = await uploadQuestionWithImage(
                    data,
                    userData,
                    initialPostData,
                    uploaderProfile,
                )
                toast.success("post created")
                navigate(`/post/${dbPost?.$id}/null`)

            } else {

                dbPost = await uploadPostWithUnsplashAPI(initialPostData, data, userData, uploaderProfile)

                if (dbPost) {
                    toast.success("post created")
                    navigate(`/post/${dbPost?.$id}/null`)
                    return
                }

            }

        } catch (error) {
            const message = error instanceof Error ? error.message : error
            console.error(message)
            toast.error(message || "something went wrong")
        }

    }

    const updatePost = async ({ post, initialPostData }) => {

        try {

            const { thumbnailFile } = initialPostData
            const { imageURL, imageID } = JSON.parse(post?.queImage)

            if (thumbnailFile) {
                if (imageID) await appwriteService.deleteThumbnail(imageID)
                const webpFile = await convertToWebPFile(thumbnailFile);
                const dbThumbnail = await appwriteService.createThumbnail({ file: webpFile });
                const imageURL = await appwriteService.getThumbnailPreview(dbThumbnail?.$id);

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    queImage: JSON.stringify({ imageURL, imageID: dbThumbnail.$id }),
                    pollQuestion,
                    pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)),
                    trustedResponderPost: isAdmin
                }, categoryValue);


                toast.success("post updated")
            } else if (thumbnailURL && !imageID) {

                const dbPost = await appwriteService.updatePost(post?.$id, {
                    ...data,
                    queImage: JSON.stringify({ imageURL: thumbnailURL, imageID: null }),
                    pollQuestion: pollQuestion,
                    pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)),
                    trustedResponderPost: isAdmin
                }, categoryValue);

                setNotification({ message: "Post Updated", type: "success" })
            } else if (thumbnailURL && imageID) {

                const dbPost = await appwriteService.updatePost(post?.$id, {
                    ...data,
                    pollQuestion,
                    pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)),
                    trustedResponderPost: isAdmin
                }, categoryValue);
                setNotification({ message: "Post Updated", type: "success" })
            } else {

                if (imageID) await appwriteService.deleteThumbnail(imageID)
                const unsplashImg = await fetch(`https://api.unsplash.com/search/photos?query=${categoryValue}&per_page=10&client_id=${conf.unsplashApiKey}`)
                const UnsplashRes = await unsplashImg.json();
                const ImgArrUnsplash = UnsplashRes.results
                const randomIndex = Math.floor(Math.random() * 10);


                const ImgURL = ImgArrUnsplash[randomIndex]?.urls?.regular || ImgArrUnsplash[randomIndex]?.urls?.small

                const queImage = JSON.stringify({ imageURL: ImgURL, imageID: null });

                const dbPost = await appwriteService.updatePost(post?.$id, {
                    ...data,
                    queImage,
                    pollQuestion,
                    pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)),
                    trustedResponderPost: isAdmin
                }, categoryValue);


                setNotification({ message: "Post Updated", type: "success" })
            }

            navigate("/");

        } catch (error) {
            console.log(error)
            toast.error("Post is not updated")
        }

    }




    return { createPost, updatePost }

}


export default useSubmitPost