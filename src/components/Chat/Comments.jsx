import "./Chat.css";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Icons } from "../index";
import conf from "../../conf/conf";
import { Button } from "../ui/button";
import CommentRTE from "./CommentRTE";
import SubComment from "./SubComment";
import { Spinner } from "../ui/spinner";
import commentService, { COMMENT_PAGE_SIZE } from "../../appwrite/comment";

const FALLBACK_AVATAR = "/NoProfile.jpg";

/* ------------------------------ helpers ------------------------------ */

const logError = (error) => {
  if (import.meta.env.DEV) console.error(error);
};

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : "Something went wrong";

// profile.profileImage is a JSON string: '{"profileImageURL": "..."}'
const getProfileImageUrl = (profile) => {
  try {
    const raw = profile?.profileImage;
    if (!raw) return FALLBACK_AVATAR;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const url = parsed?.profileImageURL;
    return url ? url.replace("/preview", "/view") : FALLBACK_AVATAR;
  } catch {
    return FALLBACK_AVATAR;
  }
};

const renderHtml = (html) => (html ? parse(DOMPurify.sanitize(html)) : null);

/* --------------------------- single comment --------------------------- */

const CommentCard = ({
  comment: c,
  userData,
  authStatus,
  onDelete,
  onReply,
  onDeleteReply,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDelete =
    userData?.$id &&
    (userData.$id === c?.profile?.$id || userData.$id === conf.myPrivateUserID);

  const handleReplyToggle = () => {
    if (!authStatus) return toast.error("Please log in to reply");
    setIsReplying((open) => !open);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget; 
    const value = new FormData(form).get("reply")?.toString().trim();
    if (!value) return toast.error("Please enter a reply");

    setIsSubmitting(true);
    const ok = await onReply(c.$id, c.subComment, value);
    setIsSubmitting(false);

    if (ok) {
      form.reset();
      setIsReplying(false);
    }
  };

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-md hover:shadow-xl transition-all duration-200 mt-3">
      <time className="my-2 text-xs text-slate-500" dateTime={c?.$createdAt}>
        {new Date(c?.$createdAt).toLocaleString()}
      </time>

      <section>
        {/* Header */}
        <div className="flex justify-between items-start">
          <Link to={`/profile/${c?.profile?.$id}`} id={`Comment${c?.$id}`}>
            <div className="flex gap-3 items-center cursor-pointer">
              <img
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm hover:scale-105 transition-transform"
                src={getProfileImageUrl(c?.profile)}
                alt={`${c?.name ?? "User"}'s avatar`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
              />
              <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                {c?.name}
              </span>
            </div>
          </Link>

          {canDelete && (
            <button
              type="button"
              aria-label="Delete comment"
              onClick={() => onDelete(c.$id)}
              className="cursor-pointer text-slate-500 hover:text-red-500 transition-colors"
            >
              <Icons.trashcan />
            </button>
          )}
        </div>

        {/* Body (sanitized) */}
        <div className="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 border-indigo-300 dark:border-indigo-500">
          {renderHtml(c?.commentContent)}
        </div>
      </section>

      {/* Reply toggle */}
      <div className="flex justify-end mt-3">
        <button
          type="button"
          aria-expanded={isReplying}
          onClick={handleReplyToggle}
          className="cursor-pointer bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow hover:shadow-md hover:scale-105 transition"
        >
          {isReplying ? "Cancel" : "Reply"}
        </button>
      </div>

      {/* Reply form: rendered only when open, so no CSS can hide it */}
      {isReplying && (
        <form className="mt-3" onSubmit={handleSubmit}>
          <textarea
            name="reply"
            autoFocus
            rows={4}
            aria-label={`Reply to ${c?.name ?? "comment"}`}
            placeholder="Write a reply..."
            className="w-full resize-y min-h-[72px] max-h-[260px] p-3 border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm shadow-inner focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-5 py-2 text-sm rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow transition"
          >
            {isSubmitting ? "Posting..." : "Post reply"}
          </Button>
        </form>
      )}

      <SubComment
        subComment={c?.subComment}
        deleteSubComment={onDeleteReply}
        commentId={c?.$id}
      />
    </article>
  );
};

/* ------------------------------ main list ------------------------------ */

const Comments = () => {

  const queryClient = useQueryClient();
  const { slug } = useParams();

  const authStatus = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.userData);

  const sentinelRef = useRef(null);
  const queryKey = useMemo(() => ["comments", slug], [slug]);

  const getComments = useCallback(
    async ({ pageParam }) => {
      const data = await commentService.listComment(slug, pageParam);
      const documents = data?.documents ?? [];
      return {
        comments: documents,
        nextCursor:
          documents.length === COMMENT_PAGE_SIZE
            ? documents[documents.length - 1].$id
            : undefined,
      };
    },
    [slug]
  );

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: getComments,
    staleTime: Infinity,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const comments = useMemo(() => {
    const all = data?.pages?.flatMap((page) => page.comments) ?? [];
    return Array.from(new Map(all.map((c) => [c.$id, c])).values());
  }, [data?.pages]);

  /* ---- infinite scroll ---- */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* ---- cache helpers ---- */
  const patchCommentInCache = useCallback(
    (commentId, patch) => {
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) =>
              c.$id === commentId ? { ...c, ...patch } : c
            ),
          })),
        };
      });
    },
    [queryClient, queryKey]
  );

  const removeCommentFromCache = useCallback(
    (commentId) => {
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((c) => c.$id !== commentId),
          })),
        };
      });
    },
    [queryClient, queryKey]
  );

  /* ---- actions ---- */
  const handleDeleteComment = useCallback(
    async (commentId) => {
      try {
        await commentService.deleteComment(commentId);
        removeCommentFromCache(commentId);
        toast.success("Comment deleted");
      } catch (err) {
        logError(err);
        toast.error("Could not delete comment");
      }
    },
    [removeCommentFromCache]
  );

  // Returned true on success so the card knows whether to clear and close the form.
  const handleReply = useCallback(
    async (commentId, existingReplies, text) => {
      if (!authStatus || !userData) {
        toast.error("Please log in to reply");
        return false;
      }
      try {
        const newReply = JSON.stringify({
          comment: text,
          userId: userData.$id,
          username: userData.name,
        });
        const updated = await commentService.updateComment({
          commentId,
          subComment: [...(existingReplies ?? []), newReply],
        });
        patchCommentInCache(commentId, { subComment: updated.subComment });
        return true;
      } catch (err) {
        logError(err);
        toast.error(`Reply failed: ${getErrorMessage(err)}`);
        return false;
      }
    },
    [authStatus, userData, patchCommentInCache]
  );

  const handleDeleteReply = useCallback(
    async (index, commentId, replies) => {
      try {
        const updated = await commentService.updateComment({
          commentId,
          subComment: (replies ?? []).filter((_, i) => i !== index),
        });
        patchCommentInCache(commentId, { subComment: updated.subComment });
        toast.success("Reply deleted");
      } catch (err) {
        logError(err);
        toast.error("Could not delete reply");
      }
    },
    [patchCommentInCache]
  );

  /* ---- render ---- */
  return (
    <div className="w-full md:w-[70%] px-3 py-3">
      <CommentRTE slug={slug} />

      {isPending && (
        <div className="flex justify-center py-8" role="status">
          <Spinner />
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="my-4 p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
        >
          <p>Could not load comments. {getErrorMessage(error)}</p>
          <Button type="button" onClick={() => refetch()} className="mt-2">
            Try again
          </Button>
        </div>
      )}

      {!isPending && !isError && comments.length === 0 && (
        <p className="my-6 text-center text-sm text-slate-500">
          No comments yet. Start the discussion.
        </p>
      )}

      {comments.map((c) => (
        <CommentCard
          key={c.$id}
          comment={c}
          userData={userData}
          authStatus={authStatus}
          onDelete={handleDeleteComment}
          onReply={handleReply}
          onDeleteReply={handleDeleteReply}
        />
      ))}

      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default Comments;