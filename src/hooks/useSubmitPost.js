
import profile from "@/appwrite/profile";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "@/appwrite/config";
import { useNotificationContext } from "@/context/NotificationContext";
import { uploadQuestionWithImage, uploadPostWithUnsplashAPI } from "@/lib/posts";

const useSubmitPost = () => {

    const navigate = useNavigate();
    const { setNotification } = useNotificationContext()
    const userData = useSelector((state) => state.auth.userData);
    const isAdmin = userData?.labels?.includes("admin") ? true : false;

    const createPost = async ({ initialPostData, data }) => {

        try {

            const uploaderProfile = await profile.listProfile({ slug: userData?.$id });

            if (uploaderProfile?.total === 0) {
                setNotification({ message: "Your Profile is not Verified", type: "error" })
                return
            }

            if (initialPostData?.thumbnailFile) {

                const dbPost = await uploadQuestionWithImage(
                    data,
                    userData,
                    initialPostData,
                    uploaderProfile,
                )
                setNotification({ message: "Post Created", type: "success" })
                navigate(`/post/${dbPost?.$id}/null`)

            } else {

                const dbPost = await uploadPostWithUnsplashAPI(initialPostData, data, userData, uploaderProfile)

                if (dbPost) {
                    setNotification({ message: "Post Created", type: "success" })
                    navigate(`/post/${dbPost?.$id}/null`)
                    return
                } else {
                    setNotification({ message: "Post is not Created", type: "error" })
                }
            }
        } catch (error) {
            console.log("Error creating post : ", error)
            setNotification({ message: "Post is not Created", type: "error" })
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

                setNotification({ message: "Post Updated", type: "success" })
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
            setNotification({ message: "Post is Not Updated", type: "error" })
        }

    }




    return { createPost, updatePost }

}


export default useSubmitPost