import "./BrowseQuestions.css";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Spinner } from "../index";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { categoriesArr } from "../AskQue/Category";
import appwriteService from "../../appwrite/config";
import { useAskContext } from "../../context/AskContext";
import React, { useEffect, useState, useRef } from "react";

const BrowseQuestions = ({ switchTrigger, setSwitchTrigger }) => {
  const { category, searchInput } = useParams();
  const { register, handleSubmit, setValue, reset, getValues } = useForm({});

  const spinnerRef = useRef();
  const BrowseQuestionLeft = useRef();
  const BrowseQuestionRight = useRef();


  const [isLoading, setIsLoading] = useState(true);
  const [lastPostID, setLastPostID] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [totalFilteredQueries, settotalFilteredQueries] = useState(0);

  const {
    hasMorePostsInBrowseQuestions,
    sethasMorePostsInBrowseQuestions,
    queries,
    setQueries,
    isDarkModeOn,
  } = useAskContext();
  const [isPostAvailable, setisPostAvailable] = useState(true);

  const [isSearching, setisSearching] = useState(false);

  const submit = async (data) => {

    setisSearching((prev) => true);
    sethasMorePostsInBrowseQuestions(true);
    const filteredQuestions = await appwriteService.getPostsWithQueries({
      ...data,
    });

    const isArray = Array.isArray(filteredQuestions);

    if (isArray) {
      sethasMorePostsInBrowseQuestions(false);
      setIsLoading(false);
      settotalFilteredQueries(0);
      setLastPostID(null);
      setisPostAvailable(false);
    } else {
      setIsLoading(true);
      setisPostAvailable(true);
      if (filteredQuestions.documents.length > 0) {
        settotalFilteredQueries(filteredQuestions.total);
        setQueries((prev) => filteredQuestions.documents);
      } else {
        settotalFilteredQueries(0);
        setQueries((prev) => []);
        setisPostAvailable(false);
      }
    }
    setisSearching((prev) => false);
    // setSwitchTrigger((prev) => false)
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
    if (queries.length >= totalFilteredQueries) {
      setIsLoading(false);
      sethasMorePostsInBrowseQuestions(false);
      setLastPostID((prev) => null);
    } else {
      setLastPostID((prev) => queries[queries.length - 1]?.$id);
      setIsLoading(true);
      sethasMorePostsInBrowseQuestions(true);
    }
  }, [queries, isIntersecting, isLoading]);

  useEffect(() => {
    const getMoreQueries = async () => {
      const data = getValues();
      const filteredQuestions = await appwriteService.getPostsWithQueries({
        ...data,
        lastPostID,
      });

      if (filteredQuestions.length !== 0) {
        setQueries((prev) => [...prev, ...filteredQuestions.documents]);
      }
    };

    if (isIntersecting) {
      if (lastPostID !== null) {
        getMoreQueries();
      }
    }
  }, [isIntersecting]);

  useEffect(() => {
    const ref = spinnerRef.current;
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting((prev) => entry.isIntersecting);
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
  }, [spinnerRef.current, queries, lastPostID, totalFilteredQueries]);

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
    sethasMorePostsInBrowseQuestions(false);
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
            {isSearching ? "Searching..." : "Apply Filter"}
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
              <label
                className={`${isDarkModeOn ? "text-white" : "text-black"}`}
                htmlFor="BrowseQuestions_Most_Viewed"
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
              <label
                className={`${isDarkModeOn ? "text-white" : "text-black"}`}
                htmlFor="BrowseQuestions_Less_Viewed">
                Less Viewed
              </label>
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
                className={`cursor-pointer ${isDarkModeOn ? "text-white" : "text-black"
                  }`}
                htmlFor="BrowseQuestion_PostAge_Recent"
              >
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
                className={`cursor-pointer ${isDarkModeOn ? "text-white" : "text-black"
                  }`}
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
                className={`cursor-pointer ${isDarkModeOn ? "text-white" : "text-black"
                  }`}
                htmlFor="BrowseQuestion_Least_Commented"
              >
                Least Commented
              </label>
            </div>
          </div>
        </div>

        <div>
          <div>
            <p className={`${isDarkModeOn ? "text-white" : "text-black"}`}>
              Favourite :{" "}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              {...register("Like_Dislike")}
              name="Like_Dislike"
              id="BrowseQuestion_Liked"
              value={"Most Liked"}
            />
            <label
              className={`${isDarkModeOn ? "text-white" : "text-black"}`}
              htmlFor="BrowseQuestion_Liked"
            >
              Most liked
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              {...register("Like_Dislike")}
              name="Like_Dislike"
              id="BrowseQuestion_Disliked"
              value={"Most Disliked"}
            />
            <label
              className={`${isDarkModeOn ? "text-white" : "text-black"}`}
              htmlFor="BrowseQuestion_Disliked"
            >
              Most disliked
            </label>
          </div>
        </div>

        <div>
          <div>
            <p className={`${isDarkModeOn ? "text-white" : "text-black"}`}>
              Posts By :{" "}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              defaultChecked={true}
              type="radio"
              {...register("PostFrom")}
              name="PostFrom"
              id="BrowseQuestion_From_All"
              value={"All"}
            />
            <label
              className={`${isDarkModeOn ? "text-white" : "text-black"}`}
              htmlFor="BrowseQuestion_From_All">All</label>
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
              className={`${isDarkModeOn ? "text-white" : "text-black"}`}
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
        className={`${switchTrigger ? "hidden lg:block" : "block"} h-[80dvh]`}
        id="BrowseQuestions_Filtered_Questions">
        {!isPostAvailable && <p className="text-center"> No Posts Available</p>}
        {queries?.map((querie, index) => {
          if (isPostAvailable !== true) {
            return;
          }
          return (
            <div key={querie.$id}>
              <span
                className={`BrowseQuestions_querieName`}
              >
                {querie.name}
              </span>

              <Link to={`/post/${querie.$id}/${null}`}>
                <p
                  className={`${isDarkModeOn ? "text-white" : "text-black"}`}
                >
                  {querie.title}
                </p>
                <div
                  id="BrowseQuestions_created_category_views"
                  className="flex gap-3 flex-wrap"
                >
                  <span>
                    {new Date(querie.$createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span>{querie.category}</span>
                  <div className="flex justify-center items-center">
                    <span
                      className={`${isDarkModeOn ? "text-white" : "text-black"
                        }`}
                    >
                      {querie.views}
                    </span>
                    <i
                      className={`fa-solid fa-eye ${isDarkModeOn ? "text-white" : "text-black"
                        }`}
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div>
                    <span
                      className={`${isDarkModeOn ? "text-white" : "text-black"
                        }`}
                    >
                      {querie.commentCount}
                    </span>
                    <i
                      className={`fa-solid fa-comment ${isDarkModeOn ? "text-white" : "text-black"
                        }`}
                    ></i>
                  </div>
                  <div>
                    <span
                      className={`${isDarkModeOn ? "text-white" : "text-black"
                        }`}
                    >
                      {querie?.like}
                    </span>
                    <i
                      className={`fa-solid fa-thumbs-up ${isDarkModeOn ? "text-white" : "text-black"
                        }`}
                    ></i>
                  </div>

                  <div>
                    <span
                      className={`${isDarkModeOn ? "text-white" : "text-black"
                        }`}
                    >
                      {querie?.dislike}
                    </span>
                    <i
                      className={`fa-solid fa-thumbs-down ${isDarkModeOn ? "text-white" : "text-black"
                        }`}
                    ></i>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {isLoading && hasMorePostsInBrowseQuestions && (
          <section ref={spinnerRef} className="flex justify-center">
            <Spinner />
          </section>
        )}
      </div>
    </div>
  );
};

export default BrowseQuestions;
