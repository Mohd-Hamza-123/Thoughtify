import { useCallback } from "react";
import profile from "@/appwrite/profile";
import appwriteService from "@/appwrite/config";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import authService from "@/appwrite/auth";
import { useSelector } from "react-redux";

export const usePost = () => {

  const getPosts = useCallback(async (object) => {

    const { pageParam: lastPostID } = object
    const posts = await appwriteService.getPosts({ lastPostID });
    let documents = posts?.documents

    let x = documents.map(async (post) => {
      const userId = post?.userId
      const profileInfo = await profile.listSingleProfile(userId)
      const verified = profileInfo?.verified
      const profileImage = profileInfo?.profileImage ? JSON.parse(profileInfo?.profileImage) : null
      const imageURL = profileImage ? profileImage?.profileImageURL : null
      return { ...post, profileImage: imageURL, verified }
    })

    documents = await Promise.all(x)

    const documentsLength = posts?.documents.length

    return {
      documents: documents,
      nextCursor: documentsLength ? documents[documentsLength - 1]?.$id : undefined
    }
  }, []);

  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: Infinity,
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
  })
}


export const useTotalPost = () => {

  function totalPost(profileId) {
    return useQuery({
      queryKey: ["totalPost", profileId],
      queryFn: async () => {
        const user = await authService.getCurrentUser();
        if (!user?.$id) {
          throw new Error("User not found");
        }
        return appwriteService.getTotalPosts(user.$id);
      },
      staleTime: 1000 * 5,
    });
  }

  return {totalPost};
};

