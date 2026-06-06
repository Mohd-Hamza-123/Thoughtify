import React, { useEffect, useMemo, useRef, useState } from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Spinner } from "../";
import { Button } from "../ui/button.jsx";
import { categoryArr } from "../AskQue/Category";
import realTime from "../../appwrite/realTime.js";

const Opinions = ({ visitedProfileUserID }) => {
  const spinnerRef = useRef(null);

  const defaultFilters = {
    userID: visitedProfileUserID,
    PostAge: "Recent",
    category: "All Category",
    AfterDate: "",
    BeforeDate: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(true);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultFilters,
  });

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isPending,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["profileOpinions", visitedProfileUserID, filters],
    queryFn: async ({ pageParam = null }) => {
      const response = await realTime.getCommentsWithQueries({
        ...filters,
        lastPostID: pageParam,
      });

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
    enabled: Boolean(visitedProfileUserID),
  });

  const comments = useMemo(() => {
    return data?.pages?.flatMap((page) => page.documents) || [];
  }, [data]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "userID") return false;
      if (!value) return false;
      if (key === "PostAge" && value === "Recent") return false;
      if (key === "category" && value === "All Category") return false;
      return true;
    }).length;
  }, [filters]);

  const submit = (data) => {
    setFilters({
      ...data,
      userID: visitedProfileUserID,
    });

    if (window.innerWidth < 1024) {
      setShowFilters(false);
    }
  };

  const resetFilter = () => {
    reset(defaultFilters);
    setFilters(defaultFilters);
    toast.success("Filters reset successfully");
  };

  useEffect(() => {
    if (!visitedProfileUserID) return;

    setFilters((prev) => ({
      ...prev,
      userID: visitedProfileUserID,
    }));
  }, [visitedProfileUserID]);

  useEffect(() => {
    const element = spinnerRef.current;
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

  return (
    <main className="h-[calc(100dvh-130px)] rounded-2xl bg-slate-50 p-3">
      <div className="mx-auto flex h-full max-w-7xl gap-4">
        {showFilters && (
          <aside className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm lg:w-[320px]">
            <form onSubmit={handleSubmit(submit)} className="flex h-full flex-col">
              <div className="sticky top-0 z-10 rounded-t-2xl border-b border-slate-200 bg-white p-4">
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
                <section className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">
                    Opinion age
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

                  <div>
                    <label className="mb-1 block text-xs text-slate-500">
                      After date
                    </label>
                    <input
                      {...register("AfterDate")}
                      type="date"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-500">
                      Before date
                    </label>
                    <input
                      {...register("BeforeDate")}
                      type="date"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                </section>
              </div>

              <div className="rounded-b-2xl border-t border-slate-200 bg-white p-4">
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
            showFilters ? "hidden lg:block" : "block"
          }`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Profile Opinions
              </h1>
              <p className="text-sm text-slate-500">
                {comments.length} opinion{comments.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="rounded-xl lg:hidden"
              onClick={() => setShowFilters(true)}
            >
              Filters
            </Button>
          </div>

          {isPending ? (
            <div className="flex h-[70%] items-center justify-center">
              <Spinner />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex h-[70%] flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-slate-800">
                No opinions found
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
              {comments.map((comment) => (
                <article
                  key={comment?.$id}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
                >
                  <Link
                    to={`/post/${comment?.postid}/${comment?.$id}`}
                    className="block"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {comment?.name || "Unknown user"}
                        </p>

                        <div className="mt-2 line-clamp-3 text-sm leading-6 text-slate-800">
                          {parse(comment?.commentContent || "")}
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                        {comment?.category || "General"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                        {comment?.$createdAt
                          ? new Date(comment.$createdAt).toDateString()
                          : "No date"}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                        <i className="fa-solid fa-comments" />
                        <span>{comment?.subComment?.length || 0}</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div ref={spinnerRef} className="flex justify-center py-6">
            {isFetchingNextPage && <Spinner />}
            {!hasNextPage && comments.length > 0 && (
              <p className="text-sm text-slate-400">No more opinions</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Opinions;