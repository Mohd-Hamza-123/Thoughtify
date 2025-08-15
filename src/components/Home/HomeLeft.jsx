import { SecondLoader } from "..";
import { Button } from "../ui/button";
import { PostCard, Spinner } from "..";
import appwriteService from "@/appwrite/config";
import { checkAppWriteError } from "@/messages";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useRef, useEffect } from "react";

const HomeLeft = ({ switchTrigger, isTrustedResponder }) => {

  const homeLeft = useRef(null);
  const spinnerRef = useRef(null);


  const getPosts = async ({ lastPostID }) => {
    const posts = await appwriteService.getPosts({ lastPostID });
    console.log(posts)
    const documents = posts?.documents
    const documentsLength = posts?.documents.length
    // console.log(documents[documentsLength - 1]?.$id)
    return {
      documents: documents,
      nextCursor: documentsLength ? documents[documentsLength - 1]?.$id : undefined
    }
  }

  const { data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      return getPosts({ lastPostID: pageParam })
    },
    staleTime: Infinity,
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
  })

  const posts = data?.pages?.flatMap(page => page.documents) ?? [];
  // console.log(posts);

  useEffect(() => {
    const ref = spinnerRef.current;

    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // console.log(entry.isIntersecting)
          if (entry.isIntersecting) fetchNextPage()
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        }
      );

      observer.observe(ref);
      return () => ref && observer.unobserve(ref);
    }
  }, [fetchNextPage, hasNextPage]);


  if (isPending)
    return (
      <div className={`h-[400px] w-full md:w-[65%] relative Home_Left flex justify-center items-center ${switchTrigger === true ? "block" : "hidden"}`}>
        <SecondLoader />
      </div>
    )
  else if (isError) {
    return <div className={`w-[65%] flex flex-col items-center justify-center gap-2 ${switchTrigger === true ? "block" : "hidden"}`}>
      <span>{checkAppWriteError(error?.message)}</span>
      {!error?.message && <p className="select-none dark:text-white">Something went wrong !</p>}
      <Button
        variant="destructive"
        onClick={() => location.reload()}>
        Reload
      </Button>
    </div>
  }
  else
    return (
      <div
        ref={homeLeft}
        className={`w-full flex-col md:w-[65%] flex md:flex-col gap-4 md:block ${switchTrigger === true ? "block" : "hidden"}`}>

        {posts?.map((post) => {
          if (isTrustedResponder === false) return <PostCard
            key={post?.$id}
            {...post}
          />
          else if (post?.trustedResponderPost) return <PostCard
            key={post?.$id}
            {...post}
          />
        })}

        {hasNextPage && (
          <div ref={spinnerRef} className="flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    );
};

export default HomeLeft;
