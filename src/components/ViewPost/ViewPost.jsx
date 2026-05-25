import "../../index.css";
import { Spinner } from "..";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from "react-router-dom";
import { makeCodeBlock } from "../../helpers/code-block-formatting";
import { ViewPostLikeDislikeBookmark, ViewPostMainContent } from "..";

const ViewPost = () => {

  const ViewPostRef = useRef();
  const viewPostLeft = useRef();
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const { slug, filterCommentID } = useParams();
  const [post, setPost] = useState(null);

  const getPost = async () => {
    let data = null
    const posts = queryClient.getQueryData(["posts"]);
    const pages = posts?.pages

    if (!Array.isArray(pages) || !pages.length) {
      navigate("/")
      return
    }

    pages?.flatMap((page) => {
      data = page.documents.find((p) => p.$id === slug)
    });

    if (!data) {
      navigate("/")
      return
    }
    setPost(data)
  }

  useEffect(() => {
    makeCodeBlock()
    getPost()
  }, [])

  return post ? <div
    ref={ViewPostRef}
    className="w-full relative flex">

    <section ref={viewPostLeft} className="p-3 w-full md:w-[70%] overflow-hidden">
      <ViewPostMainContent post={post} />
      <ViewPostLikeDislikeBookmark post={post} />
    </section>

    {/* <section
        ref={viewPostRight}
        className={`ViewPost_Related_Filter_Comment_Questions w-[30%] ${isNavbarHidden ? "" : "active"
          }`}>
        <div id="ViewPost_RelatedQuestions">
          <p>{post?.category} Related :</p>
          {!isRelatedQueriesExist && (
            <span className="">
              No Related Post is Available of {post?.category}
            </span>
          )}

          {isRelatedQueriesExist && (
            <ul>
              {relatedQueriesArr?.map((QuestionObj, index) => {
                return (
                  <li
                    key={QuestionObj?.$id}
                    onClick={() => {
                      navigateToRelatedPost(QuestionObj?.$id);
                      if (viewPostLeft.current && viewPostRight.current) {
                        if (!window.screen.width <= 500) return;
                        viewPostLeft.current.classList.toggle("none");
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {QuestionObj?.title
                      ? QuestionObj?.title
                      : QuestionObj?.pollQuestion}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {filterCommentID !== "null" && filteredComment && (
          <div className={`ViewPost_Filtered_Comments`}>
            <p>Comment :</p>
            <div>
              <div className="flex justify-between ViewPost_Filtered_Comments_Name_Delete">
                <p>{filteredComment?.name}</p>
                {filteredComment?.authid === userData?.$id && (
                  <i
                    onClick={() => {
                      deleteComments(filterCommentID);
                    }}
                    className="fa-solid fa-trash cursor-pointer"
                  ></i>
                )}
              </div>
              <article>{parse(filteredComment?.commentContent)}</article>
            </div>
          </div>
        )}
      </section> */}
  </div> : <div className="w-full flex justify-center items-center h-[80dvh]">
    <Spinner />
  </div>
};

export default ViewPost;
