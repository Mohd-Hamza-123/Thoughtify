import { toast } from "sonner"
import conf from "@/conf/conf";
import profile from "@/appwrite/profile";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "@/appwrite/config";
import { useQueryClient } from "@tanstack/react-query";
import convertToWebPFile from "@/helpers/convert-image-into-webp";

const useCreatePost = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userData = useSelector((state) => state.auth.userData);
    const isAdmin = userData?.labels?.includes("admin") ? true : false;

    const createPost = async ({ data, file }) => {

        try {

            const uploaderProfile = await profile.getProfileById({ $id: userData?.$id, query: ["name"] });

            let dbPost = null

            if (file) {

                let imageId = null
                const webpFile = await convertToWebPFile(file);
                const image = await appwriteService.createThumbnail({ file: webpFile })
                imageId = image.$id

                const imageURL = await appwriteService.getThumbnailPreview(imageId)
                const queImage = JSON.stringify({ imageURL: imageURL, imageID: imageId })

                dbPost = await appwriteService.createPost({
                    ...data,
                    queImage,
                    userId: userData.$id,
                    name: userData.name,
                    trustedResponderPost: isAdmin,
                });

            } else {

                const response = await fetch(`https://api.unsplash.com/search/photos?query=${data.category}&per_page=10&client_id=${conf.unsplashApiKey}`)

                if (response.ok) {

                    const UnsplashRes = await response.json();
                    const ImgArrUnsplash = UnsplashRes.results

                    const randomIndex = Math.floor(Math.random() * 10);

                    const imageURL = ImgArrUnsplash[randomIndex]?.urls?.regular || ImgArrUnsplash[randomIndex]?.urls?.small

                    const queImage = JSON.stringify({ imageURL })

                    const payload = {
                        ...data,
                        queImage,
                        userId: userData.$id,
                        name: userData.name,
                        trustedResponderPost: isAdmin,
                    }

                    dbPost = await appwriteService.createPost(payload);

                }
            }

            queryClient.setQueryData(['posts'], (oldData) => {
                if (!oldData) return oldData

                return {
                    ...oldData,
                    pages: oldData.pages.map((page, index) => {
                        // add new post to first page only
                        if (index === 0) {
                            return {
                                ...page,
                                documents: [dbPost, ...page.documents]
                            }
                        }

                        return page
                    })
                }
            })

            navigate(`/post/${dbPost?.$id}/null`)

        } catch (error) {
            const message = error instanceof Error ? error.message : error
            console.error(message)
            toast.error(message || "something went wrong")
        }

    }



    return { createPost }

}


export default useCreatePost