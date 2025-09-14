import "../../index.css";
import { SecondLoader } from "..";
import { Client } from "appwrite";
import conf from "../../conf/conf";
import profile from "@/appwrite/profile";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import realTime from "../../appwrite/realTime";
import { useQuery } from "@tanstack/react-query";
import appwriteService from "../../appwrite/config";
import { makeCodeBlock } from "../../helpers/code-block-formatting";
import { ViewPostLikeDislikeBookmark, ViewPostMainContent } from "..";

const ViewPost = () => {

  const viewPostLeft = useRef();
  const ViewPostRef = useRef();
  const { slug, filterCommentID } = useParams();
  const { data: post, isPending } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const data = await appwriteService.getPost(slug)
      const userId = data?.userId
      const profileInfo = await profile.listSingleProfile(userId)
      const profileImage = profileInfo?.profileImage ? JSON.parse(profileInfo?.profileImage) : null
      const imageURL = profileImage ? profileImage?.profileImageURL : null
      return {
        ...data, profileImage: imageURL
      }
    }
  })

  // console.log(post)

  let client = new Client()
    .setEndpoint(conf.appwriteURL)
    .setProject(conf.appwriteProjectId);

  // Update Post in RealTime
  // useEffect(() => {
  //   const realtime = client.subscribe(
  //     `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents.${slug}`,
  //     (response) => {
  //       if (
  //         response.events.includes(
  //           "databases.*.collections.*.documents.*.update"
  //         )
  //       ) {
  //         setPost((prev) => response?.payload);
  //       }
  //     }
  //   );

  //   return () => realtime();
  // }, []);





  useEffect(() => {
    makeCodeBlock()
  }, [post])

  return !isPending ? (
    <div
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
    </div>
  ) : (
    <div className="w-full flex justify-center items-center h-[80dvh]">
      <SecondLoader />
    </div>
  );
};

export default ViewPost;
