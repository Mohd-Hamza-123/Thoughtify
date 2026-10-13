import React, { useEffect, useMemo, useRef } from "react";
import appwriteService from "../../appwrite/config";
import { Icons, Spinner } from "..";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 5;

const Bookmark = ({ visitedUserProfile }) => {
  
  const spinnerRef = useRef(null);
  const userID = visitedUserProfile?.$id;
  const bookmarksIDs = visitedUserProfile?.bookmarks ?? [];
  console.log(bookmarksIDs)

  const stableIds = useMemo(() => bookmarksIDs.slice(), [bookmarksIDs]);

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["bookmarkPosts", userID],
    enabled: Boolean(userID && stableIds.length),
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      
      const start = pageParam;
      const end = Math.min(start + PAGE_SIZE, stableIds.length);
      const slice = stableIds.slice(start, end);

      const posts = await Promise.all(
        slice.map((id) =>
          appwriteService
            .getPost(id)
            .catch(() => null) 
        )
      );

      const items = posts.filter(Boolean);
      const nextCursor = end < stableIds.length ? end : undefined;

      return { items, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  
  const bookMarkPosts = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.items),
    [data]
  );


  useEffect(() => {
    const node = spinnerRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  if (!stableIds.length) {
    return (
      <div className="text-center p-8 text-xl text-gray-600 dark:text-gray-300">
        No bookmarks yet.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-8 text-sm text-red-600">
        Failed to load bookmarks{error?.message ? `: ${error.message}` : ""}.
      </div>
    );
  }

  return (
    <div
      id="Profile_Bookmark_Filter"
      className="flex w-full justify-center">
      <div
        id="Profile_Bookmark_Filtered_Bookmark"
        className="w-full max-w-3xl px-3 sm:px-4 md:px-0">
       
        {status === "pending" && (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        )}

        {bookMarkPosts.map((bookmark) => (
          <div
            className="BookMark_Posts group mb-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
            key={bookmark?.$id}>
            <Link
              to={`/post/${bookmark?.$id}/${null}`}
              className="block p-4 sm:p-5">
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:underline truncate">
                {bookmark?.title}
              </p>

              <div className="BrowseBookmark_created_category_views mt-3 flex flex-wrap gap-2 sm:gap-3">
                <span className="Favourite_CreatedAt inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 text-xs">
                  {bookmark?.$createdAt
                    ? new Date(bookmark.$createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </span>

                <span className="Favourite_Category inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 text-xs">
                  {bookmark?.category}
                </span>

                <div className="flex items-center gap-1 rounded-full bg-gray-50 dark:bg-gray-800 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300">
                  <span>{bookmark?.views ?? 0}</span>
                  <Icons.views />
                </div>

                <div className="flex items-center gap-1 rounded-full bg-gray-50 dark:bg-gray-800 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300">
                  <span>{bookmark?.commentCount ?? 0}</span>
                  <Icons.comment />
                </div>

                <div className="flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/30 px-2.5 py-1 text-xs text-green-700 dark:text-green-300">
                  <span>{bookmark?.like ?? 0}</span>
                  <Icons.like />
                </div>

                <div className="flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-900/30 px-2.5 py-1 text-xs text-red-700 dark:text-red-300">
                  <span>{bookmark?.dislike ?? 0}</span>
                  <Icons.dislike />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>


      {hasNextPage && (
        <section
          ref={spinnerRef}
          className="flex w-full justify-center my-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 px-4 py-2 shadow-sm">
            <Spinner />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Loading more…
            </span>
          </div>
        </section>
      )}

      {isFetching && !isFetchingNextPage && (
        <div className="sr-only">Updating…</div>
      )}
    </div>
  );
};

export default Bookmark;
