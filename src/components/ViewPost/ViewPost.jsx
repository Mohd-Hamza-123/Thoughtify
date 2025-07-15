import "../../index.css";
import { SecondLoader } from "..";
import { Client } from "appwrite";
import conf from "../../conf/conf";
import parse from "html-react-parser";
import { Button } from "../ui/button";
import realTime from "../../appwrite/realTime";
import { useEffect, useState, useRef } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector, useDispatch } from "react-redux";
import { getInitialPost } from "../../store/postsSlice";
import { useParams, useNavigate } from "react-router-dom";
import { getCommentsInRedux } from "../../store/commentsSlice";
import { makeCodeBlock } from "../../helpers/code-block-formatting";
import { ViewPostLikeDislikeBookmark, ViewPostMainContent } from "..";
import { getAllVisitedQuestionsInViewPost } from "../../store/ViewPostsSlice";

const ViewPost = () => {

  let client = new Client()
    .setEndpoint(conf.appwriteURL)
    .setProject(conf.appwriteProjectId);

  const [post, setPost] = useState(null);

  const dispatch = useDispatch();
  const { slug, filterCommentID } = useParams();
  const navigate = useNavigate();
  const viewPostLeft = useRef();
  const viewPostRight = useRef();

  const commentsInRedux = useSelector((state) => state.commentsSlice.comments);
  const userData = useSelector((state) => state?.auth?.userData);
  const userAuthStatus = useSelector((state) => state?.auth?.status);
  const initialPost = useSelector((state) => state.postsSlice.initialPosts);


  // useState for views,comments,date
  const [postdate, setpostdate] = useState("");
  const [postViews, setpostViews] = useState(0);
  const [postCommentCount, setpostCommentCount] = useState(0);
  // poll
  const [totalPollVotes, setTotalPollVotes] = useState(0);
  const [pollVotersAuthIDsAndVote, setpollVotersAuthIDsAndVote] = useState([]);
  const [isPollOpinionVisible, setIsPollOpinionVisible] = useState(false);
  const [filteredComment, setfilteredComment] = useState(null);


  const navigateToRelatedPost = (postId) => {
    navigate(`/post/${postId}/${null}`);
  };
  const deleteComments = async (documentid) => {
    realTime
      .deleteComment(documentid)
      .then(() => {
        let commentsAfterDeletion = commentsInRedux.filter(
          (comment) => comment.$id !== documentid
        );

        dispatch(
          getCommentsInRedux({
            comments: commentsAfterDeletion,
            isMerge: false,
          })
        );
      })
      .catch((err) => { });

    appwriteService
      .updatePostViews(post?.$id, post.views, post.commentCount - 1)
      .then((res) => {
        dispatch(getInitialPost({ initialPosts: [res] }));

        setpostCommentCount((prev) => post.commentCount - 1);
      })
      .catch((error) => { });

    setfilteredComment((prev) => null);
  };

  useEffect(() => {
    if (filterCommentID !== "null") {
      realTime
        .getSingleComment(filterCommentID)
        .then((res) => {
          setfilteredComment(res);
        })
        .catch((res) => null);
    }
  }, [filterCommentID]);

  useEffect(() => {
    if (initialPost?.some((obj) => obj?.$id === slug) === false) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) {
            setPost((prev) => post);

            setTotalPollVotes((prev) => post?.totalPollVotes);
          }
          dispatch(getAllVisitedQuestionsInViewPost({ questions: post }));
        })
        .catch(() => {
          return null;
        });
    } else {
      let postObject = initialPost.find((obj) => obj.$id === slug);
      setPost((prev) => postObject);
    }
  }, [slug, initialPost]);

  // useEffect(() => {
  //   if (post) {
  //     setTotalPollVotes((prev) => post?.totalPollVotes);
  //     setpollVotersAuthIDsAndVote((prev) => {
  //       return post?.pollVotersID?.filter((obj) => {
  //         if (JSON.parse(obj)?.pollVoterID === userData?.$id) {
  //           setIsPollOpinionVisible(true);
  //           return obj;
  //         }
  //       });
  //     });
  //   }
  // }, [post]);


  // Update Post in RealTime
  useEffect(() => {
    const realtime = client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents.${slug}`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          setPost((prev) => response?.payload);
        }
      }
    );

    return () => realtime();
  }, []);

  const [isRelatedQueriesExist, setisRelatedQueriesExist] = useState(false);
  const [relatedQueriesArr, setRelatedQueriesArr] = useState([]);

  useEffect(() => {
    const getRelatedQueries = () => {
      let relatedArr = initialPost?.filter((initialPostObj) => {
        if (
          initialPostObj?.category === post?.category &&
          post?.$id !== initialPostObj?.$id
        ) {
          return initialPostObj;
        }
      });
      if (relatedArr.length > 0) {
        setRelatedQueriesArr((prev) => relatedArr);
        setisRelatedQueriesExist(true);
      } else {
        setisRelatedQueriesExist(false);
        setRelatedQueriesArr((prev) => []);
      }
    };
    const getDate_Views_Comments_Details = () => {
      let x = initialPost?.find(
        (postinRedux) => postinRedux?.$id === post?.$id
      );

      if (x) {
        setpostCommentCount(x.commentCount);
        setpostViews(x.views);
        setpostdate(x.$createdAt);
      }
    };
    if (initialPost.length > 0) getRelatedQueries();
    if (initialPost.length > 0) getDate_Views_Comments_Details();
  }, [post, initialPost]);

  const updatePoll = async (postId, index, option, vote, pollVoterID) => {
    if (!userAuthStatus) {
      setNotificationPopMsgNature((prev) => false);
      setnotificationPopMsg((prev) => "Please Login");
      return;
    }
    let totalPollVotes = post.totalPollVotes;
    let pollOptions = post.pollOptions.map((obj) => JSON.parse(obj));
    let pollVotersID = [...post.pollVotersID].map((obj) => JSON.parse(obj));

    // checking whether user is first time giving vote or he has already done
    let indexOfVotedOption = pollVotersID.findIndex(
      (obj) => obj.pollVoterID === pollVoterID
    );
    // if index === -1 voter not exist.
    if (indexOfVotedOption === -1) {
      totalPollVotes = post.totalPollVotes + 1;
      pollVotersID = [...pollVotersID, { pollVoterID, optionNum: index }];
      pollOptions[index].vote = pollOptions[index].vote + 1;
    } else {
      totalPollVotes = post.totalPollVotes;
      pollVotersID = [...pollVotersID];

      let myPollVoterID = pollVotersID.filter(
        (obj) => obj.pollVoterID === userData.$id
      );

      if (index === myPollVoterID[0].optionNum) {
        let remainingObject = pollVotersID.filter(
          (obj) => obj.pollVoterID !== userData.$id
        );
        pollVotersID = remainingObject;

        pollOptions[index].vote = pollOptions[index].vote - 1;
        totalPollVotes = post.totalPollVotes - 1;
      } else {
        let previousSelectedOptionIndex = myPollVoterID[0].optionNum;

        const desiredIndex = pollVotersID.findIndex(
          (obj) => obj.pollVoterID === userData.$id
        );

        pollVotersID[desiredIndex].optionNum = index;
        pollOptions[index].vote = pollOptions[index].vote + 1;
        pollOptions[previousSelectedOptionIndex].vote =
          pollOptions[previousSelectedOptionIndex].vote - 1;
      }
    }

    for (let i = 0; i < pollOptions.length; i++) {
      if (pollOptions[i].vote < 0) {
        return;
      }
    }
    pollVotersID = pollVotersID.map((obj) => JSON.stringify(obj));
    pollOptions = pollOptions.map((obj) => JSON.stringify(obj));

    const update = await appwriteService.updatePostWithQueries({
      pollOptions,
      postId,
      totalPollVotes,
      pollVotersID,
    });

    setPost((prev) => update);
    dispatch(getAllVisitedQuestionsInViewPost({ questions: update }));
    setTotalPollVotes((prev) => update.totalPollVotes);
    let myPollVoterID = pollVotersID.filter(
      (obj) => obj.pollVoterID === userData.$id
    );
    if (myPollVoterID !== -1) {
      setIsPollOpinionVisible(true);
    }
  };

  const ViewPostRef = useRef();
  const lastScrollY = useRef(window.scrollY);

  const [isNavbarHidden, setisNavbarHidden] = useState(false);

  const handleScroll = (e) => {
    let position = e.target.scrollTop;

    sessionStorage.setItem("scrollPositionofViewPost", position.toString());
    if (lastScrollY.current < position) {
      setisNavbarHidden(true);
    } else {
      setisNavbarHidden(false);
    }

    lastScrollY.current = position;
  };
  const deletePostComments = async () => {
    if (!userAuthStatus) {
      // setNotificationPopMsgNature((prev) => false);
      // setnotificationPopMsg((prev) => "Please Login");
      return;
    }
    try {
      const listComments = await realTime.listComment(post?.$id);

      let totalCommentsToDelete = listComments?.total;
      while (totalCommentsToDelete > 0) {
        const listComments = await realTime.listComment(post?.$id);
        totalCommentsToDelete = listComments?.total;
        for (let i = 0; i < listComments?.documents?.length; i++) {
          realTime.deleteComment(listComments.documents[i].$id);
        }
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (ViewPostRef.current) {
      const storedScrollPosition = sessionStorage.getItem("scrollPositionofViewPost");
      const parsedScrollPosition = parseInt(storedScrollPosition, 10);
      ViewPostRef.current.scrollTop = parsedScrollPosition;
    }
  }, [ViewPostRef.current]);

  useEffect(() => {
    makeCodeBlock()
  }, [post?.content])

  return post ? (
    <div
      ref={ViewPostRef}
      className="w-full relative flex"
      onScroll={handleScroll}
    >

      <Button
        variant="outline"
        className="flex justify-center items-center md:hidden"
        onClick={() => {
          if (viewPostLeft.current && viewPostRight.current)
            viewPostLeft.current.classList.toggle("none")
        }}
      >
        <i className="bx bxs-grid-alt"></i>
      </Button>

      <section ref={viewPostLeft} className="p-3 w-[70%]">
        <ViewPostMainContent post={post} />
        <ViewPostLikeDislikeBookmark post={post} />
      </section>

      <section
        ref={viewPostRight}
        className={`ViewPost_Related_Filter_Comment_Questions w-[30%] ${isNavbarHidden ? "" : "active"
          }`}
      >
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
      </section>
    </div>
  ) : (
    <div className="w-full flex justify-center items-center h-[80dvh]">
      <SecondLoader />
    </div>
  );
};

export default ViewPost;
