import { Spinner } from "..";
import { Button } from "../ui/button";
import { usePost } from "@/hooks/usePost";
import { PostCard } from "@/components/index";
import { useNavigate } from "react-router-dom";
import { checkAppWriteError } from "@/messages";
import React, { useRef, useEffect, useMemo, useCallback } from "react";

const HomeLeft = ({ switchTrigger, isTrustedResponder }) => {

  const homeLeft = useRef(null);
  const navigate = useNavigate();
  const spinnerRef = useRef(null);

  const {
    data,
    error,
    isError,
    isPending,
    hasNextPage,
    fetchNextPage,
  } = usePost()

  const posts = useMemo(() => data?.pages?.flatMap(page => page?.documents) ?? [], [data?.pages]);

  const filteredPosts = useMemo(() => {

    if (!isTrustedResponder) {
      return posts;
    }

    return posts.filter(post => post?.trustedResponderPost);

  }, [posts, isTrustedResponder]);

  useEffect(() => {

    const ref = spinnerRef.current
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,        // 👈 use the scrolling container
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(ref);

    return () => observer.unobserve(ref);

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

  if (isPending)
    return (
      <div
        className={`w-full min-h-[75dvh] md:w-[65%] flex justify-center items-center ${switchTrigger === true ? "flex" : "hidden"
          }`}
      >
        <Spinner />
      </div>
    );

  if (isError) {
    return (
      <div
        className={`w-full min-h-[75dvh] px-3 md:px-0 md:w-[65%] flex flex-col items-center justify-center gap-2 text-center ${switchTrigger === true ? "flex" : "hidden"
          }`}
      >
        <span>{checkAppWriteError(error?.message)}</span>

        {!error?.message && (
          <p className="select-none dark:text-white font-bold">
            Something went wrong !
          </p>
        )}

        <Button variant="destructive" onClick={() => location.reload()}>
          Reload
        </Button>
      </div>
    );
  } else if (!isPending && filteredPosts.length === 0) {
    return (
      <div className="w-full min-h-[75dvh] px-3 md:px-0 md:w-[65%] flex flex-col items-center justify-center gap-2 text-center">
        <p>No Posts Found</p>

        <Button variant="outline" onClick={() => navigate("/ask-question")}>
          Create a Post
        </Button>
      </div>
    );
  } else
    return (
      <div
        ref={homeLeft}
        className={`w-full md:w-[65%] flex flex-col gap-4 px-3 md:px-0 ${switchTrigger === true ? "flex" : "hidden"
          }`}
      >
        {filteredPosts?.map(renderPostCard)}

        {hasNextPage && (
          <div ref={spinnerRef} className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
      </div>
    );
};

export default HomeLeft;
