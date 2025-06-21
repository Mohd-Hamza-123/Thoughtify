import { PostCard } from "..";
import { useDispatch } from "react-redux";
import appwriteService from "@/appwrite/config";
import { useQuery } from "@tanstack/react-query";
import { getInitialPost } from "@/store/postsSlice";
import { useAskContext } from "@/context/AskContext";
import React, { useRef, useEffect, useState } from "react";
import { SecondLoader } from "..";
import { Button } from "../ui/button";
import increaseViews from "@/services/increasePostView";

const HomeLeft = ({ className }) => {

  const dispatch = useDispatch();

  const homeLeft = useRef(null);
  const spinnerRef = useRef(null);

  const {
    hasMorePostsInHome,
    sethasMorePostsInHome,
  } =
    useAskContext();

  // const initialPost = useSelector((state) => state.postsSlice?.initialPosts);

  const [isLoading, setIsLoading] = useState(false);
  const [lastPostID, setLastPostID] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const getAllPosts = async () => {
    setIsLoading(true);
    try {
      // if (initialPost?.length === 0) {
      const posts = await appwriteService.getPosts({ lastPostID });
      // console.log(posts);
      return posts;
      return
      if (posts === false) {
        setPosts(false);
      }

      if (initialPost?.length < posts.total) {
        sethasMorePostsInHome(true);
      } else {
        sethasMorePostsInHome(false);
      }
      if (posts) {
        setPosts(posts?.documents);
        let lastID = posts?.documents[posts?.documents.length - 1]?.$id;
        setLastPostID(lastID);
        dispatch(getInitialPost({ initialPosts: posts?.documents }));
      }
      // }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    staleTime: Infinity,
  });
  // console.log(data);

  useEffect(() => {
    getAllPosts();
  }, []);

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
      <div className={`w-[65%] relative Home_Left flex justify-center items-center`}>
        <SecondLoader />
      </div>
    )
  else if (isError) {
    return <div className={`w-[65%] flex flex-col items-center justify-center gap-2`}>
      <p className="select-none dark:text-white">
        Internet Connection Error
      </p>
      <Button
        variant="destructive"
        onClick={() => location.reload()}
      >
        Reload
      </Button>
    </div>
  }
  else
    return (
      <div ref={homeLeft} className={`w-full flex-col-reverse md:w-[65%] flex md:flex-col gap-4`}>
        {data?.documents?.map((post) => (
          <div
            key={post?.$id}
            onClick={() => increaseViews(post?.$id)}>
            <PostCard {...post} />
          </div>
        ))}

        {isLoading && hasMorePostsInHome && (
          <div ref={spinnerRef} className="flex justify-center">
            <span className="Home_loader"></span>
          </div>
        )}
      </div>
    );
};

export default HomeLeft;
