import { PostCard } from "..";
import { SecondLoader } from "..";
import { Button } from "../ui/button";
import appwriteService from "@/appwrite/config";
import { checkAppWriteError } from "@/messages";
import { useQuery } from "@tanstack/react-query";
import { useAskContext } from "@/context/AskContext";

import React, { useRef, useEffect, useState } from "react";

const HomeLeft = ({ switchTrigger, isTrustedResponder }) => {

  const homeLeft = useRef(null);
  const spinnerRef = useRef(null);

  const {
    hasMorePostsInHome,
    sethasMorePostsInHome,
  } =
    useAskContext();

  const [isLoading, setIsLoading] = useState(false);
  const [lastPostID, setLastPostID] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const getAllPosts = async () => {
    setIsLoading(true);
    const posts = await appwriteService.getPosts({ lastPostID });
    setIsLoading(false);
    return posts
  }


  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    staleTime: Infinity,
  });

  useEffect(() => {
    const ref = spinnerRef.current;

    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 1,
        }
      );

      observer.observe(ref);
      return () => ref && observer.unobserve(ref);
    }
  }, [spinnerRef.current]);

  useEffect(() => {
    // if (isIntersecting && hasMorePostsInHome) {
    //   const getAllPosts = async () => {
    //     let LastID = initialPost[initialPost?.length - 1]?.$id;
    //     const posts = await appwriteService.getPosts({ lastPostID: LastID });

    //     if (initialPost.length < posts?.total) {
    //       sethasMorePostsInHome(true);
    //     } else {
    //       sethasMorePostsInHome(false);
    //     }

    //     if (posts?.documents?.length === 0) {
    //       setIsLoading(false);
    //       return;
    //     }
    //     let lastID = posts?.documents[posts?.documents?.length - 1]?.$id;
    //     setLastPostID(lastID);
    //     dispatch(getInitialPost({ initialPosts: posts?.documents }));
    //   };
    //   getAllPosts();
    // }
  }, [isIntersecting, hasMorePostsInHome]);


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
        className={`w-full flex-col-reverse md:w-[65%] flex md:flex-col gap-4 md:block ${switchTrigger === true ? "block" : "hidden"}`}>

        {data?.documents?.map((post) => {
          if (isTrustedResponder === false) return <PostCard
            key={post?.$id}
            {...post}
          />
          else if (post?.trustedResponderPost) return <PostCard
            key={post?.$id}
            {...post}
          />
        })}

        {isLoading && hasMorePostsInHome && (
          <div ref={spinnerRef} className="flex justify-center">
            <span className="Home_loader"></span>
          </div>
        )}
      </div>
    );
};

export default HomeLeft;
