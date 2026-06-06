import { toast } from "sonner";
import { Button } from "../ui/button";
import { Icons, Spinner } from "../index";
import { useForm } from "react-hook-form";
import { categoryArr } from "../AskQue/Category";
import { Link, useParams } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";

const defaultFilters = {
  Title: "",
  Viewed: "",
  PostAge: "",
  Commented: "",
  Like_Dislike: "",
  PostFrom: "All",
  category: "All Category",
  AfterDate: "",
  BeforeDate: "",
};

const BrowseQuestions = ({ switchTrigger, setSwitchTrigger }) => {

  const { category, searchInput } = useParams();
  const [filters, setFilters] = useState(defaultFilters);
  const loadMoreRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: defaultFilters,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["filteredQuestions", filters],
    queryFn: async ({ pageParam = null }) => {
      const response = await appwriteService.getPostsWithQueries(
        filters,
        pageParam
      );

      const documents = response?.documents || [];

      return {
        documents,
        nextCursor: documents.length
          ? documents[documents.length - 1].$id
          : undefined,
      };
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = useMemo(() => {
    return data?.pages?.flatMap((page) => page.documents) || [];
  }, [data]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (!value) return false;
      if (key === "PostAge" && value === "Recent") return false;
      if (key === "Like_Dislike" && value === "Most Liked") return false;
      if (key === "PostFrom" && value === "All") return false;
      if (key === "category" && value === "All Category") return false;
      return true;
    }).length;
  }, [filters]);

  const submit = (formData) => {
    setFilters(formData);

    if (window.innerWidth < 768 && setSwitchTrigger) {
      setSwitchTrigger(false);
    }
  };

  const resetFilter = () => {
    reset(defaultFilters);
    setFilters(defaultFilters);
    toast.success("Filters reset successfully");
  };

  useEffect(() => {
    if (category && category !== "null") {
      setValue("category", category);
      setFilters((prev) => ({
        ...prev,
        category,
      }));
    }

    if (searchInput && searchInput !== "null") {
      setValue("Title", searchInput);
      setFilters((prev) => ({
        ...prev,
        Title: searchInput,
      }));
    }
  }, [category, searchInput, setValue]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetching
        ) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "250px",
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, isFetching]);

  const renderMetric = (value, Icon) => (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
      <span>{value || 0}</span>
      <Icon className="text-slate-500" />
    </span>
  );

  return (
    <main className="h-[calc(100dvh-120px)] bg-slate-50 px-3 py-4">
      <div className="mx-auto flex h-full max-w-7xl gap-4">
        {switchTrigger && (
          <aside className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm md:w-[320px]">
            <form
              onSubmit={handleSubmit(submit)}
              className="flex h-full flex-col"
            >
              <div className="sticky top-0 z-10 border-b border-slate-200 bg-white p-4 rounded-t-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Filters
                    </h2>
                    <p className="text-sm text-slate-500">
                      {activeFilterCount} active filter
                      {activeFilterCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilter}
                    className="rounded-xl"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-4">
                <section className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-700"
                  >
                    Search by title
                  </label>
                  <input
                    id="title"
                    {...register("Title")}
                    placeholder="Example: JavaScript promise"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">
                    Sort by views
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="filter-option">
                      <input
                        {...register("Viewed")}
                        type="radio"
                        value="MostViewed"
                      />
                      Most
                    </label>

                    <label className="filter-option">
                      <input
                        {...register("Viewed")}
                        type="radio"
                        value="lessViewed"
                      />
                      Less
                    </label>
                  </div>
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">
                    Post age
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="filter-option">
                      <input
                        {...register("PostAge")}
                        type="radio"
                        value="Recent"
                      />
                      Recent
                    </label>

                    <label className="filter-option">
                      <input
                        {...register("PostAge")}
                        type="radio"
                        value="Oldest"
                      />
                      Oldest
                    </label>
                  </div>
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">
                    Comments
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="filter-option">
                      <input
                        {...register("Commented")}
                        type="radio"
                        value="Most Commented"
                      />
                      Most
                    </label>

                    <label className="filter-option">
                      <input
                        {...register("Commented")}
                        type="radio"
                        value="Least Commented"
                      />
                      Least
                    </label>
                  </div>
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">
                    Favourite
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="filter-option">
                      <input
                        {...register("Like_Dislike")}
                        type="radio"
                        value="Most Liked"
                      />
                      Liked
                    </label>

                    <label className="filter-option">
                      <input
                        {...register("Like_Dislike")}
                        type="radio"
                        value="Most Disliked"
                      />
                      Disliked
                    </label>
                  </div>
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">
                    Posted by
                  </p>

                  <div className="space-y-2">
                    {["All", "Responders", "Non Responders"].map((item) => (
                      <label key={item} className="filter-option justify-start">
                        <input
                          {...register("PostFrom")}
                          type="radio"
                          value={item}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </section>

                <section className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    {...register("category")}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="All Category">All Category</option>
                    {categoryArr?.map((item, index) => (
                      <option
                        key={`${item.category}-${index}`}
                        value={item.category}
                      >
                        {item.category}
                      </option>
                    ))}
                  </select>
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">
                    Date range
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="afterDate"
                        className="mb-1 block text-xs text-slate-500"
                      >
                        After date
                      </label>
                      <input
                        {...register("AfterDate")}
                        type="date"
                        id="afterDate"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="beforeDate"
                        className="mb-1 block text-xs text-slate-500"
                      >
                        Before date
                      </label>
                      <input
                        {...register("BeforeDate")}
                        type="date"
                        id="beforeDate"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="border-t border-slate-200 bg-white p-4 rounded-b-2xl">
                <Button
                  type="submit"
                  disabled={isFetching}
                  className="w-full rounded-xl bg-cyan-500 text-white hover:bg-cyan-600"
                >
                  {isFetching ? "Applying..." : "Apply Filters"}
                </Button>
              </div>
            </form>
          </aside>
        )}

        <section
          className={`h-full flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
            switchTrigger ? "hidden md:block" : "block"
          }`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
                   
              <p className="text-sm text-slate-500">
                {posts.length} question{posts.length !== 1 ? "s" : ""} found
              </p>
            
            <Button
              type="button"
              variant="outline"
              className="rounded-xl md:hidden"
              onClick={() => setSwitchTrigger?.(true)}
            >
              Filters
            </Button>
          </div>

          {isPending ? (
            <div className="flex h-[70%] items-center justify-center">
              <Spinner />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex h-[70%] flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-slate-800">
                No questions found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing or resetting your filters.
              </p>
              <Button
                type="button"
                onClick={resetFilter}
                className="mt-4 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post?.$id}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
                >
                  <Link to={`/post/${post.$id}/${null}`} className="block">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {post?.name || "Unknown user"}
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-slate-900 transition group-hover:text-cyan-600">
                          {post?.title}
                        </h2>
                      </div>

                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                        {post?.category || "General"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                        {post?.$createdAt
                          ? new Date(post.$createdAt).toDateString()
                          : "No date"}
                      </span>

                      {renderMetric(post?.views, Icons.views)}
                      {renderMetric(post?.commentCount, Icons.comment)}
                      {renderMetric(post?.like, Icons.like)}
                      {renderMetric(post?.dislike, Icons.dislike)}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="flex justify-center py-6">
            {isFetchingNextPage && <Spinner />}
            {!hasNextPage && posts.length > 0 && (
              <p className="text-sm text-slate-400">No more questions</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default BrowseQuestions;