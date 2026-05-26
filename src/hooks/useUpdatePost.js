import { toast } from "sonner"
import appwriteService from "@/appwrite/config";
import { useQueryClient } from "@tanstack/react-query";
import convertToWebPFile from "@/helpers/convert-image-into-webp";
import { useNavigate } from "react-router-dom";
import conf from "@/conf/conf";


const useUpdatePost = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const updatePost = async ({ data, file, oldPost }) => {

        try {

            const postId = oldPost.$id

            const { imageURL, imageID } = oldPost?.queImage ? JSON.parse(oldPost?.queImage) : {}

            // console.log(imageID)
            let dbPost = null

            if (file) {

                // console.log(file)
                // console.log(imageID)

                if (imageID) await appwriteService.deleteThumbnail(imageID)
                const webpFile = await convertToWebPFile(file);
                const dbThumbnail = await appwriteService.createThumbnail({ file: webpFile });
                const imageURL = await appwriteService.getThumbnailPreview(dbThumbnail?.$id);
                const queImage = JSON.stringify({ imageURL: imageURL, imageID: dbThumbnail.$id })

                const payload = {
                    ...data,
                    queImage,
                }

                dbPost = await appwriteService.updatePost({ slug: postId, payload });
                console.log(dbPost)

            } else if (imageURL && !imageID) {

                const payload = {
                    ...data,
                    queImage: JSON.stringify({ imageURL: imageURL }),
                }

                dbPost = await appwriteService.updatePost({ slug: postId, payload });

            } else if (imageURL && imageID) {

                dbPost = await appwriteService.updatePost({ slug: postId, payload: data });
                console.log("imageURL and ImageID")
            } else {

                if (imageID) await appwriteService.deleteThumbnail(imageID)
                const unsplashImg = await fetch(`https://api.unsplash.com/search/photos?query=${data.category}&per_page=10&client_id=${conf.unsplashApiKey}`)
                const UnsplashRes = await unsplashImg.json();
                const ImgArrUnsplash = UnsplashRes.results
                const randomIndex = Math.floor(Math.random() * 10);


                const ImgURL = ImgArrUnsplash[randomIndex]?.urls?.regular || ImgArrUnsplash[randomIndex]?.urls?.small

                const queImage = JSON.stringify({ imageURL: ImgURL });

                const payload = {
                    ...data,
                    queImage,
                }

                dbPost = await appwriteService.updatePost({ slug: postId, payload });

            }

            console.log(dbPost)

            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        documents: page.documents.map((existingPost) => {
                            if (postId === dbPost.$id) {
                                return dbPost;
                            }
                            return existingPost;
                        }),
                    })),
                };
            });

            navigate("/post/" + dbPost.$id + "/null");

        } catch (error) {
            const message = error instanceof Error ? error.message : error
            console.error(message)
            toast.error("Post is not updated")
        }

    }


    return { updatePost }

}

export default useUpdatePost