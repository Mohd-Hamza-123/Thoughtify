import { Icons, Spinner } from "../index";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { categoriesArr } from "../AskQue/Category";
import appwriteService from "../../appwrite/config";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useMemo } from "react";
import { useNotificationContext } from "@/context/NotificationContext";

const BrowseQuestions = ({ switchTrigger, setSwitchTrigger }) => {

  const { setNotification } = useNotificationContext()

  const { category, searchInput } = useParams();
  const { register, handleSubmit, setValue, reset, getValues } = useForm({});

  const filters = useRef({Like_Dislike: 'Most Liked'})
  const spinnerRef = useRef();
  const BrowseQuestionLeft = useRef();
  const BrowseQuestionRight = useRef();


  const { data, refetch, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["filteredQuestions"],
    queryFn: async ({ pageParam }) => {

      const filteredQuestions = await appwriteService.getPostsWithQueries({
        ...filters.current,
      }, pageParam)

      const documents = filteredQuestions.documents
      const documentsLength = documents.length
      return {
        documents,
        nextCursor: documentsLength ? documents[documentsLength - 1].$id : undefined
      }
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: true
  })

  const posts = useMemo(() => {
    return data?.pages?.flatMap((page) => page.documents)
  }, [data])



  const submit = async (data) => {

    filters.current = data
    refetch()
    if (
      BrowseQuestionLeft.current &&
      BrowseQuestionRight.current &&
      window.innerWidth < 500
    ) {
      BrowseQuestionLeft.current.classList.toggle("none");
      BrowseQuestionRight.current.classList.toggle("none");
    }
  };

  useEffect(() => {
    const ref = spinnerRef.current;
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
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
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (category !== "null") {
      setValue("category", category);
      const data = getValues();

      submit(data);
    } else if (searchInput !== "null") {
      setValue("Title", searchInput);
      const data = getValues();

      submit(data);
    }
  }, [searchInput]);


  const resetFilter = () => {
    reset();
  };


  return (
    <div className="flex md:flex-row flex-col gap-2 w-screen px-2 mt-2 h-[80dvh]">
      {switchTrigger && <form
        ref={BrowseQuestionLeft}
        className="w-full md:w-[27%] flex flex-col gap-6 p-5 bg-white rounded-xl shadow-sm h-full overflow-y-auto"
        onSubmit={handleSubmit(submit)}>
        {/* Buttons */}
        <div className="flex justify-between items-center gap-3">
          <Button
            variant="outline"
            type="Submit"
            className="px-4 py-2 rounded-lg border-gray-300 hover:bg-blue-50"
          >
            {isFetching ? "Searching..." : "Apply Filter"}
          </Button>
          <Button
            variant="destructive"
            onClick={resetFilter}
            type="reset"
            className="px-4 py-2 rounded-lg"
          >
            Reset Filter
          </Button>
        </div>

        {/* Title */}
        <div id="BrowseQuestions_PostTitle" className="space-y-2">
          <p className="font-medium text-gray-700">Filter by Post Title :</p>
          <div className="flex gap-3 items-center">
            <label htmlFor="BrowseQuestions_PostTitle_Filter" className="text-sm text-gray-600">
              Title:
            </label>
            <input
              {...register("Title", { required: false })}
              id="BrowseQuestions_PostTitle_Filter"
              placeholder="Title"
              className="w-full px-2 py-1 border border-gray-300 rounded-lg outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* Views */}
        <div>
          <p className="font-medium text-gray-700">Filter By Views :</p>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("Viewed")} type="radio" value="MostViewed" className="accent-blue-500" />
              <span>Most Viewed</span>
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("Viewed")} type="radio" value="lessViewed" className="accent-blue-500" />
              <span>Less Viewed</span>
            </label>
          </div>
        </div>

        {/* Post Age */}
        <div>
          <p className="font-medium text-gray-700">Filter By Post Age :</p>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("PostAge")} type="radio" value="Recent" className="accent-blue-500" />
              <span>Recent</span>
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("PostAge")} type="radio" value="Oldest" className="accent-blue-500" />
              <span>Oldest</span>
            </label>
          </div>
        </div>

        {/* Comments */}
        <div>
          <p className="font-medium text-gray-700">Filter By Comment :</p>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("Commented")} type="radio" value="Most Commented" className="accent-blue-500" />
              <span>Most Commented</span>
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("Commented")} type="radio" value="Least Commented" className="accent-blue-500" />
              <span>Least Commented</span>
            </label>
          </div>
        </div>

        {/* Likes/Dislikes */}
        <div>
          <p className="font-medium text-gray-700">Favourite :</p>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("Like_Dislike")} type="radio" value="Most Liked" className="accent-green-500" />
              <span>Most Liked</span>
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("Like_Dislike")} type="radio" value="Most Disliked" className="accent-red-500" />
              <span>Most Disliked</span>
            </label>
          </div>
        </div>

        {/* Post By */}
        <div>
          <p className="font-medium text-gray-700">Post By :</p>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("PostFrom")} type="radio" value="All" defaultChecked className="accent-blue-500" />
              <span>All</span>
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("PostFrom")} type="radio" value="Responders" className="accent-blue-500" />
              <span>Responders</span>
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input {...register("PostFrom")} type="radio" value="Non Responders" className="accent-blue-500" />
              <span>Non-Responders</span>
            </label>
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="font-medium text-gray-700">Filter By Category :</p>
          <div className="flex items-center gap-2 mt-1">
            <label className="text-sm text-gray-600">Category :</label>
            <select
              {...register("category")}
              className="px-1 py-1 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Category" defaultChecked>
                All Category
              </option>
              {categoriesArr?.map((category, index) => (
                <option key={category.category + index}>{category.category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div id="BrowseQuestions_FilterByDate">
          <p className="font-medium text-gray-700">Filter By Date :</p>
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-2">
              <label htmlFor="AfterDate" className="text-sm text-gray-600">After Date :</label>
              <input
                {...register("AfterDate")}
                type="date"
                id="AfterDate"
                className="px-3 py-1 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="BeforeDate" className="text-sm text-gray-600">Before Date :</label>
              <input
                {...register("BeforeDate")}
                type="date"
                id="BeforeDate"
                className="px-3 py-1 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </form>
      }

      <div
        ref={BrowseQuestionRight}
        className={`${switchTrigger ? "hidden sm:block" : "block"} h-[80dvh] overflow-y-scroll px-4 w-full md:w-[73%]`}>
        {posts?.length === 0 && <p className="text-center text-gray-500 mt-8"> No Posts Available</p>}

        <div className="space-y-4">
          {posts?.map((post) => {
            return (
              <div
                key={post?.$id}
                className="hover:shadow-md transition rounded-xl p-3 border border-slate-200">
                {/* Author */}
                <span className="text-md font-md">{post.name}</span>

                {/* Post Title */}
                <Link to={`/post/${post.$id}/${null}`}>
                  <h4 className="text-lg font-semibold mt-1 mb-2 text-gray-800 transition">
                    {post.title}
                  </h4>

                  {/* Meta info */}
                  <div
                    id="BrowseQuestions_created_category_views"
                    className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {/* Date */}
                    <span className="tag-style">
                      {new Date(post.$createdAt).toDateString()}
                    </span>

                    {/* Category */}
                    <span className="tag-style">
                      {post.category}
                    </span>

                    {/* Views */}
                    <div className="tag-style flex items-center gap-1">
                      <span>{post.views}</span>
                      <Icons.views className="" />
                    </div>

                    {/* Comments */}
                    <div className="tag-style flex items-center gap-1">
                      <span>{post.commentCount}</span>
                      <Icons.comment className="" />
                    </div>

                    {/* Likes */}
                    <div className="tag-style flex items-center gap-1">
                      <span>{post?.like}</span>
                      <Icons.like className="" />
                    </div>

                    {/* Dislikes */}
                    <div className="tag-style flex items-center gap-1">
                      <span>{post?.dislike}</span>
                      <Icons.dislike className="" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {hasNextPage && (
          <section ref={spinnerRef} className="flex justify-center py-4">
            <Spinner />
          </section>
        )}
      </div>

    </div>
  );
};

export default BrowseQuestions;
