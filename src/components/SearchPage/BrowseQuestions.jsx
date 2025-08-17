import "./BrowseQuestions.css";
import { Spinner } from "../index";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { categoriesArr } from "../AskQue/Category";
import appwriteService from "../../appwrite/config";
import React, { useEffect, useRef, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNotificationContext } from "@/context/NotificationContext";

const BrowseQuestions = ({ switchTrigger, setSwitchTrigger }) => {

  const { setNotification } = useNotificationContext()

  const { category, searchInput } = useParams();
  const { register, handleSubmit, setValue, reset, getValues } = useForm({});

  const filters = useRef({})
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
    enabled: false
  })

  const posts = useMemo(() => {
    return data?.pages?.flatMap((page) => page.documents)
  }, [data])

  console.log(posts)

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
    <div className="flex md:flex-row flex-col gap-2">
      {switchTrigger && <form
        ref={BrowseQuestionLeft}
        id="BrowseQuestions_Filters"
        className="w-full flex flex-col gap-5 p-3 relative h-full"
        onSubmit={handleSubmit(submit)}>

        <div className="flex justify-between">
          <Button variant='outline' type="Submit">
            {isFetching ? "Searching..." : "Apply Filter"}
          </Button>
          <Button variant="destructive" onClick={resetFilter} type="reset">Reset Filter</Button>
        </div>
        <div id="BrowseQuestions_PostTitle">
          <p>Filter by Post Title : </p>
          <div className="flex gap-2 items-center">
            <label
              htmlFor="BrowseQuestions_PostTitle_Filter">
              Title:
            </label>
            <input
              {...register("Title", {
                required: false,
              })}
              id="BrowseQuestions_PostTitle_Filter"
              placeholder="Title"
            />
          </div>
        </div>

        <div>
          <p>Filter By Views :</p>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                {...register("Viewed")}
                type="radio"
                name="Viewed"
                id="BrowseQuestions_Most_Viewed"
                value={"MostViewed"}
              />
              <label htmlFor="BrowseQuestions_Most_Viewed"
              >
                Most Viewed
              </label>
            </div>
            <div className="flex gap-2">
              <input
                {...register("Viewed")}
                type="radio"
                name="Viewed"
                id="BrowseQuestions_Less_Viewed"
                value={"lessViewed"}
              />
              <label htmlFor="BrowseQuestions_Less_Viewed">Less Viewed</label>
            </div>
          </div>
        </div>

        <div>
          <p>Filter By Post Age :</p>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                {...register("PostAge")}
                id="BrowseQuestion_PostAge_Recent"
                type="radio"
                name="PostAge"
                value={"Recent"}
              />
              <label
                className="cursor-pointer"
                htmlFor="BrowseQuestion_PostAge_Recent">
                Recent
              </label>
            </div>
            <div className="flex gap-2">
              <input
                {...register("PostAge")}
                id="BrowseQuestion_PostAge_Oldest"
                type="radio"
                name="PostAge"
                value="Oldest"
              />
              <label
                className={`cursor-pointer`}
                htmlFor="BrowseQuestion_PostAge_Oldest">
                Oldest
              </label>
            </div>
          </div>
        </div>

        <div>
          <p>
            Filter By Comment :
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                {...register("Commented")}
                id="BrowseQuestion_Most_Commented"
                type="radio"
                name="Commented"
                value={"Most Commented"}
              />
              <label
                className="cursor-pointer"
                htmlFor="BrowseQuestion_Most_Commented"
              >
                Most Commented
              </label>
            </div>
            <div className="flex gap-2">
              <input
                {...register("Commented")}
                id="BrowseQuestion_Least_Commented"
                type="radio"
                name="Commented"
                value={"Least Commented"}
              />
              <label
                className="cursor-pointer"
                htmlFor="BrowseQuestion_Least_Commented"
              >
                Least Commented
              </label>
            </div>
          </div>
        </div>

        <div>

          <p> Favourite :</p>

          <div className="flex gap-2">
            <input
              type="radio"
              {...register("Like_Dislike")}
              name="Like_Dislike"
              id="BrowseQuestion_Liked"
              value="Most Liked"
            />
            <label htmlFor="BrowseQuestion_Liked"> Most liked </label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              {...register("Like_Dislike")}
              name="Like_Dislike"
              id="BrowseQuestion_Disliked"
              value={"Most Disliked"}
            />
            <label htmlFor="BrowseQuestion_Disliked" > Most disliked </label>
          </div>
        </div>

        <div>
          <span>Post By :</span>
          <div className="flex gap-2">
            <input
              defaultChecked={true}
              type="radio"
              {...register("PostFrom")}
              name="PostFrom"
              id="BrowseQuestion_From_All"
              value={"All"}
            />
            <label htmlFor="BrowseQuestion_From_All">All</label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              {...register("PostFrom")}
              name="PostFrom"
              id="BrowseQuestion_From_Responders"
              value={"Responders"}
            />
            <label htmlFor="BrowseQuestion_From_Responders">
              Responders
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              {...register("PostFrom")}
              name="PostFrom"
              id="BrowseQuestion_Non-Responders"
              value={"Non Responders"}
            />
            <label

              htmlFor="BrowseQuestion_Non-Responders">
              Non-Responders
            </label>
          </div>
        </div>

        <div>
          <p>
            Filter By Category :
          </p>
          <div id="BrowseQuestions_Category" className="flex gap-2">
            <label>
              Category :
            </label>
            <select
              name="category"
              {...register("category")}
              className="outline-none">
              <option
                defaultChecked
                value="All Category">
                All Category
              </option>
              {categoriesArr?.map((category, index) => (
                <option key={category.category + index}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div id="BrowseQuestions_FilterByDate">
          <p>Filter By Date :</p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <label
                htmlFor="AfterDate">
                After Date :
              </label>
              <input
                {...register("AfterDate", {
                  required: false,
                })}
                type="date"
                name="AfterDate"
                id="AfterDate"
              />
            </div>

            <div className="flex gap-1">
              <label
                htmlFor="BeforeDate">
                Before Date :
              </label>
              <input
                type="date"
                name="BeforeDate"
                id="BeforeDate"
                {...register("BeforeDate")}
              />
            </div>
          </div>
        </div>
      </form>}
      <div
        ref={BrowseQuestionRight}
        className={`${switchTrigger ? "hidden sm:block" : "block"} h-[80dvh] overflow-y-scroll`}
        id="BrowseQuestions_Filtered_Questions">
        {posts?.length === 0 && <p className="text-center"> No Posts Available</p>}
        {posts?.map((post, index) => {

          return (
            <div key={post?.$id}>
              <span>{post.name}</span>

              <Link to={`/post/${post.$id}/${null}`}>
                <p >
                  {post.title}
                </p>
                <div
                  id="BrowseQuestions_created_category_views"
                  className="flex gap-3 flex-wrap">
                  <span>
                    {new Date(post.$createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span>{post.category}</span>
                  <div className="flex justify-center items-center">
                    <span>
                      {post.views}
                    </span>
                    <i
                      className="fa-solid fa-eye"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div>
                    <span>{post.commentCount}</span>
                    <i className="fa-solid fa-comment"
                    ></i>
                  </div>
                  <div>
                    <span>
                      {post?.like}
                    </span>
                    <i
                      className={`fa-solid fa-thumbs-up"
                        }`}
                    ></i>
                  </div>

                  <div>
                    <span> {post?.dislike} </span>
                    <i
                      className="fa-solid fa-thumbs-down"
                    ></i>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {hasNextPage &&
          <section ref={spinnerRef} className="flex justify-center">
            <Spinner />
          </section>
        }
      </div>
    </div>
  );
};

export default BrowseQuestions;
