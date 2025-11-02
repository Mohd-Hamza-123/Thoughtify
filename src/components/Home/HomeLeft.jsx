import { SecondLoader } from "..";
import { Button } from "../ui/button";
import { Spinner } from "..";
import profile from "@/appwrite/profile";
import { useNavigate } from "react-router-dom";
import appwriteService from "@/appwrite/config";
import { checkAppWriteError } from "@/messages";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useRef, useEffect, useMemo, useCallback, Suspense } from "react";
const PostCard = React.lazy(() => import("../Post-Card/PostCard"));

const HomeLeft = ({ switchTrigger, isTrustedResponder }) => {

  const navigate = useNavigate()
  const homeLeft = useRef(null);
  const spinnerRef = useRef(null);


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
      return {
        ...post, profileImage: imageURL, verified
      }
    })

    documents = await Promise.all(x)

    const documentsLength = posts?.documents.length

    return {
      documents: documents,
      nextCursor: documentsLength ? documents[documentsLength - 1]?.$id : undefined
    }
  }, []);

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: Infinity,
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
  })


  const posts = useMemo(() => {
    return data?.pages?.flatMap(page => page.documents) ?? [];

  }, [data?.pages]);

  const filteredPosts = useMemo(() => {
    if (isTrustedResponder === false) {
      return posts;
    } else {
      return posts.filter(post => post?.trustedResponderPost);
    }
  }, [posts, isTrustedResponder]);

  useEffect(() => {
    const ref = spinnerRef.current;

    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {

          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          root: null,
          rootMargin: "100px", // Increased margin for better UX
          threshold: 0.1,
        }
      );

      observer.observe(ref);
      return () => ref && observer.unobserve(ref);
    }
  }, [fetchNextPage, hasNextPage]);

  // Memoize the PostCard render function
  const renderPostCard = useCallback((post) => {
    return (
      <PostCard
        key={post?.$id}
        {...post}
      />
    );
  }, []);

  // if (isPending)
  //   return (
  //     <div className={`h-[400px] w-full md:w-[65%] relative Home_Left flex justify-center items-center ${switchTrigger === true ? "block" : "hidden"}`}>
  //       <SecondLoader />
  //     </div>
  //   )
  if (isError) {
    return <div className={`w-[65%] flex flex-col items-center justify-center gap-2 ${switchTrigger === true ? "block" : "hidden"}`}>
      <span>{checkAppWriteError(error?.message)}</span>
      {!error?.message && <p className="select-none dark:text-white font-bold">Something went wrong !</p>}
      <Button
        variant="destructive"
        onClick={() => location.reload()}>
        Reload
      </Button>
    </div>
  } else if (!isPending && filteredPosts.length === 0) {
    return <div className="w-[65%] flex flex-col items-center justify-center gap-2 ">
      <p>No Posts Found</p>
      <Button
        variant=""
        onClick={() => navigate('/AskQuestion')}>
        Create a Post
      </Button>
    </div>
  }
  else
    return (
      <div
        ref={homeLeft}
        className={`w-full flex-col md:w-[65%] flex md:flex-col gap-4 md:block ${switchTrigger === true ? "block" : "hidden"}`}>
        <Suspense fallback={<div className="w-full h-full flex justify-center items-center"><SecondLoader/></div>}>
          {filteredPosts?.map(renderPostCard)}
          {hasNextPage && (
            <div ref={spinnerRef} className="flex justify-center py-4">
              <Spinner />
            </div>
          )}
        </Suspense>
      </div>
    );
};

export default HomeLeft;
