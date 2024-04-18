import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Button, Chat, HorizontalLine, UpperNavigationBar, LowerNavigationBar } from "../index";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import NoProfile from '../../assets/NoProfile.png'
import { useAskContext } from "../../context/AskContext";
import "./ViewPost.css";
import '../../index.css'
import profile from "../../appwrite/profile";
import { getAllVisitedQuestionsInViewPost } from "../../store/ViewPostsSlice";
import { getInitialPost, getResponderInitialPosts } from "../../store/postsSlice";
import realTime from "../../appwrite/realTime";
import { getCommentsInRedux } from "../../store/commentsSlice";
import notification from "../../appwrite/notification";

const ViewPost = () => {
  //Data from Redux
  const postProfilesPic = useSelector((state) => state.postsSlice?.postUploaderProfilePic)
  const commentsInRedux = useSelector((state) => state.commentsSlice.comments)
  // console.log(commentsInRedux)
  // const AllVisitedQuestions = useSelector((state) => state.viewPostsSlice.questions)

  const userData = useSelector((state) => state.auth.userData);
  const initialPost = useSelector((state) => state.postsSlice.initialPosts);
  const initialTrustedPosts = useSelector((state) => state.postsSlice.initialResponderPosts)
  // console.log(initialPost)
  const { myUserProfile,
    setMyUserProfile } = useAskContext()
  // console.log(myUserProfile)
  const [isBookMarked, setIsBookMarked] = useState(false)


  const dispatch = useDispatch()
  const { slug, filterCommentID } = useParams();
  // console.log(filterCommentID)
  const navigate = useNavigate();

  const ellipsis_Vertical = useRef();
  const ViewPost_ellipsis_Vertical = useRef();

  const [profileImgURL, setprofileImgURL] = useState('')
  const [post, setPost] = useState(null);
  // console.log(post)
  const isAuther = post && userData ? post.userId === userData.$id : false;
  // useState for views,comments,date
  const [postdate, setpostdate] = useState('')
  const [postViews, setpostViews] = useState(0)
  const [postCommentCount, setpostCommentCount] = useState(0)
  // poll 
  const [totalPollVotes, setTotalPollVotes] = useState(0)
  const [pollVotersAuthIDsAndVote, setpollVotersAuthIDsAndVote] = useState([])
  const [isPollOpinionVisible, setIsPollOpinionVisible] = useState(false)

  const navigateToRelatedPost = (postId) => {

    navigate(`/post/${postId}/${null}`);
  }
  // Filter Comment in ViewPost
  const [filteredComment, setfilteredComment] = useState(null)
  // console.log(filteredComment)

  const deleteComments = async (documentid) => {
    // return
    realTime
      .deleteComment(documentid)
      .then(() => {
        // console.log("deleted")
        let commentsAfterDeletion = commentsInRedux.filter((comment) => comment.$id !== documentid)
        // console.log("dispatched")
        dispatch(getCommentsInRedux({ comments: commentsAfterDeletion, isMerge: false }))
      })
      .catch((err) => console.log(err.message));


    appwriteService
      .updatePostViews(post?.$id, post.views, post.commentCount - 1)
      .then((res) => {
        dispatch(getInitialPost({ initialPosts: [res] }))

        setpostCommentCount((prev) => post.commentCount - 1)
      })
      .catch((error) => console.log(error))

    setfilteredComment((prev) => null)
  }

  useEffect(() => {
    if (filterCommentID !== 'null') {
      realTime
        .getSingleComment(filterCommentID)
        .then((res) => {

          setfilteredComment(res)
        })
        .catch((res) => { console.log("bye") })
    }
  }, [filterCommentID])


  useEffect(() => {
    // console.log("hi")
    if ((initialPost.some(obj => obj.$id === slug)) === false) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) {
            setPost((prev) => post)
            // console.log(post)
            setTotalPollVotes((prev) => post.totalPollVotes)
          }
          dispatch(getAllVisitedQuestionsInViewPost({ questions: post }))
        })
        .catch(() => {
          console.log("ViewPost Component Error");
        });
    } else {
      let postObject = initialPost.find(obj => obj.$id === slug)
      setPost((prev) => postObject)
    }
  }, [slug, initialPost]);

  useEffect(() => {
    // console.log("Hi")
    if (post) {
      // console.log(post.userId)
      const ProfileURLIndex = postProfilesPic.findIndex((obj) => (
        obj.userId === post.userId
      ))
      // console.log(ProfileURLIndex)
      setprofileImgURL(postProfilesPic[ProfileURLIndex]?.profilePic)
    }
  }, [post])
  useEffect(() => {
    // console.log(post)
    if (post) {
      setTotalPollVotes((prev) => post.totalPollVotes)
      setpollVotersAuthIDsAndVote((prev) => {
        return post.pollVotersID.filter((obj) => {
          if (JSON.parse(obj).pollVoterID === userData.$id) {
            setIsPollOpinionVisible(true)
            return obj
          }
        })
      })
    }

  }, [post])
  // UseEffect For bookMark
  useEffect(() => {
    // console.log(myUserProfile.bookmarks)
    if ((myUserProfile.bookmarks).includes(post?.$id)) {
      setIsBookMarked(true)
      // console.log("kya")
    } else {
      setIsBookMarked(false)
      // console.log("hua")
    }
  }, [post])
  // UseEffect For bookMark

  useEffect(() => {
    // console.log("Hamza")
    if (myUserProfile.bookmarks.includes(post?.$id)) {
      setIsBookMarked(true)
    } else {
      setIsBookMarked(false)
    }
  }, [myUserProfile])

  const [isRelatedQueriesExist, setisRelatedQueriesExist] = useState(false)
  const [relatedQueriesArr, setRelatedQueriesArr] = useState([])
  useEffect(() => {
    // console.log("Hi")
    const getRelatedQueries = () => {
      // console.log(initialPost)
      let relatedArr = initialPost.filter((initialPostObj) => {
        // console.log(post)
        if (initialPostObj?.category
          === post?.category && post?.$id !== initialPostObj.$id) {
          return initialPostObj
        }
      })
      if (relatedArr.length > 0) {
        setRelatedQueriesArr((prev) => relatedArr)
        setisRelatedQueriesExist(true)
      } else {
        setisRelatedQueriesExist(false)
        setRelatedQueriesArr((prev) => [])
      }

    }
    const getDate_Views_Comments_Details = () => {
      let x = initialPost.find((postinRedux) => postinRedux.$id === post?.$id)
      // console.log(x)
      if (x) {
        setpostCommentCount(x.commentCount)
        setpostViews(x.views)
        setpostdate(x.$createdAt)
      }
    }
    if (initialPost.length > 0) getRelatedQueries()
    if (initialPost.length > 0) getDate_Views_Comments_Details()
  }, [post, initialPost])
  const deletePost = () => {
    appwriteService
      .deletePost(post.$id)
      .then(() => {
        const newInitialPost = initialPost?.filter((prevPosts) => prevPosts?.$id !== post?.$id)
        dispatch(getInitialPost({ initialPosts: [...newInitialPost], initialPostsFlag: false }));

        const newRespondersPost = initialTrustedPosts?.filter((prevPosts) => prevPosts?.$id !== post?.$id);
        dispatch(getResponderInitialPosts({ initialResponderPosts: [...newRespondersPost], initialPostsFlag: false }));
      })
    navigate("/");
  };
  const deleteThumbnail = async () => {
    // console.log(post.queImageID)
    if (post.queImageID) {
      let deletedImg = await appwriteService.deleteThumbnail(post.queImageID)
    }
  }
  const updatePoll = async (postId, index, option, vote, pollVoterID) => {
    console.log(post)
    let totalPollVotes = post.totalPollVotes;
    let pollOptions = post.pollOptions.map(obj => JSON.parse(obj));
    let pollVotersID = [...post.pollVotersID].map((obj) => JSON.parse(obj))
    // console.log(pollVotersID)

    // checking whether user is first time giving vote or he has already done
    let indexOfVotedOption = pollVotersID.findIndex((obj) => obj.pollVoterID === pollVoterID)
    // if index === -1 voter not exist.
    if (indexOfVotedOption === -1) {
      console.log('Voter not exist : ' + indexOfVotedOption)
      totalPollVotes = post.totalPollVotes + 1;
      pollVotersID = [...pollVotersID, { pollVoterID, optionNum: index }]
      pollOptions[index].vote = pollOptions[index].vote + 1

    } else {
      // console.log('Voter Alread Exist.Last vote on Index ' + indexOfVotedOption)
      totalPollVotes = post.totalPollVotes
      pollVotersID = [...pollVotersID]
      // console.log(pollOptions)
      // console.log(pollVotersID)
      // console.log(index)
      let myPollVoterID = pollVotersID.filter((obj) => obj.pollVoterID === userData.$id)
      // console.log(myPollVoterID)
      if (index === myPollVoterID[0].optionNum) {
        console.log("Ye to pehle wala selected option tha")
        let remainingObject = pollVotersID.filter((obj) => obj.pollVoterID !== userData.$id)
        pollVotersID = remainingObject
        // console.log(pollOptions[index].vote)
        pollOptions[index].vote = pollOptions[index].vote - 1
        totalPollVotes = post.totalPollVotes - 1;
      } else {
        // return
        let previousSelectedOptionIndex = myPollVoterID[0].optionNum;
        // console.log(previousSelectedOptionIndex)
        // console.log(pollVotersID)
        const desiredIndex = pollVotersID.findIndex((obj) => obj.pollVoterID === userData.$id)
        // console.log(desiredIndex)
        // console.log(index)
        pollVotersID[desiredIndex].optionNum = index
        pollOptions[index].vote = pollOptions[index].vote + 1
        pollOptions[previousSelectedOptionIndex].vote = pollOptions[previousSelectedOptionIndex].vote - 1
        // console.log("Ye to koi aur selected option hai")
      }
    }
    // console.log(pollVotersID)
    console.log(pollOptions)

    for (let i = 0; i < pollOptions.length; i++) {
      // console.log(pollOptions[i])
      if (pollOptions[i].vote < 0) {
        return
      }
    }
    pollVotersID = pollVotersID.map((obj) => JSON.stringify(obj))
    pollOptions = pollOptions.map(obj => JSON.stringify(obj));
    // console.log(pollOptions)
    // return
    const update = await appwriteService.updatePostWithQueries({ pollOptions, postId, totalPollVotes, pollVotersID })
    console.log(update)
    setPost((prev) => update)
    dispatch(getAllVisitedQuestionsInViewPost({ questions: update }))
    setTotalPollVotes((prev) => update.totalPollVotes)
    let myPollVoterID = pollVotersID.filter((obj) => obj.pollVoterID === userData.$id)
    if (myPollVoterID !== -1) {
      setIsPollOpinionVisible(true)
    }
  }
  const like_dislike_BookMark = async (flag) => {
    const likedQuestionsInContext = myUserProfile?.likedQuestions
    const dislikedQuestionsInContext = myUserProfile?.dislikedQuestions
    const bookmarksInContext = myUserProfile?.bookmarks
    const myProfileID_In_Context = myUserProfile?.$id

    const previousLike = post?.like
    const previousDislike = post?.dislike

    if (flag === 'Like') {
      try {

        if (likedQuestionsInContext.includes(post?.$id)) {
          // update in Query
          const increaseLike = await appwriteService.updatePost_Like_DisLike({ postId: post?.$id, like: previousLike - 1, dislike: previousDislike })
          setPost((prev) => increaseLike)
          dispatch(getAllVisitedQuestionsInViewPost({ questions: increaseLike }))

          //Update In Profile
          let likedQuestions = likedQuestionsInContext.filter((likedPostIDs) => likedPostIDs !== post?.$id)
          // console.log(likedQuestions)
          const updateLikeArr_In_MyProfile = await profile.updateProfileWithQueries({ profileID: myUserProfile?.$id, likedQuestions, dislikedQuestions: dislikedQuestionsInContext, bookmarks: bookmarksInContext })
          // console.log(updateLikeArr_In_MyProfile)
          setMyUserProfile((prev) => updateLikeArr_In_MyProfile)

        } else {

          // return
          if (dislikedQuestionsInContext.includes(post?.$id)) {
            // Update in Query
            const increaseLike = await appwriteService.updatePost_Like_DisLike({ postId: post?.$id, like: previousLike + 1, dislike: previousDislike - 1 })
            dispatch(getAllVisitedQuestionsInViewPost({ questions: increaseLike }))
            setPost((prev) => increaseLike)



            //Update In Profile
            let likedQuestions = [...likedQuestionsInContext]
            likedQuestions.push(post?.$id)

            let dislikedQuestions = dislikedQuestionsInContext.filter((dislikedPostIDs) => dislikedPostIDs !== post?.$id)
            const updateLikeArr_In_MyProfile = await profile.updateProfileWithQueries({ profileID: myUserProfile?.$id, likedQuestions, dislikedQuestions, bookmarks: bookmarksInContext })
            // console.log(updateLikeArr_In_MyProfile)
            setMyUserProfile((prev) => updateLikeArr_In_MyProfile)
          } else {

            // Update in Query
            const increaseLike = await appwriteService.updatePost_Like_DisLike({ postId: post?.$id, like: previousLike + 1, dislike: previousDislike })
            // console.log(increaseLike)
            dispatch(getAllVisitedQuestionsInViewPost({ questions: increaseLike }))
            setPost((prev) => increaseLike)

            //Update In Profile
            let likedQuestions = [...likedQuestionsInContext]
            likedQuestions.push(post?.$id)
            // console.log(likedQuestions)
            const updateLikeArr_In_MyProfile = await profile.updateProfileWithQueries({ profileID: myUserProfile?.$id, likedQuestions, dislikedQuestions: dislikedQuestionsInContext, bookmarks: bookmarksInContext })
            // console.log(updateLikeArr_In_MyProfile)
            setMyUserProfile((prev) => updateLikeArr_In_MyProfile)
          }

          try {
            const createNotification = await notification.createNotification({ content: `${userData.name} has liked your post`, isRead: false, slug: `post/${slug}/null`, name: userData?.name, userID: userData.$id, userIDofReceiver: post.userId });
            console.log(createNotification)
          } catch (error) {
            console.log(error)
          }

        }
      } catch (error) {
        console.log('Post is not Liked ! error')
      }
    } else if (flag === 'Dislike') {
      try {
        if (dislikedQuestionsInContext.includes(post?.$id)) {
          // update in Query
          const decreaseDislike = await appwriteService.updatePost_Like_DisLike({ postId: post?.$id, like: previousLike, dislike: previousDislike - 1 })
          setPost((prev) => decreaseDislike)
          dispatch(getAllVisitedQuestionsInViewPost({ questions: decreaseDislike }))

          //Update In Profile
          let dislikedQuestions = dislikedQuestionsInContext.filter((dislikedPostIDs) => dislikedPostIDs !== post?.$id)
          // console.log(likedQuestions)
          const updateDislikeArr_In_MyProfile = await profile.updateProfileWithQueries({ profileID: myUserProfile?.$id, likedQuestionsInContext, dislikedQuestions: dislikedQuestions, bookmarks: bookmarksInContext })
          // console.log(updateLikeArr_In_MyProfile)
          setMyUserProfile((prev) => updateDislikeArr_In_MyProfile)
        } else {

          if (likedQuestionsInContext.includes(post?.$id)) {
            // Update in Query
            const increaseDislike = await appwriteService.updatePost_Like_DisLike({ postId: post?.$id, like: previousLike - 1, dislike: previousDislike + 1 })
            dispatch(getAllVisitedQuestionsInViewPost({ questions: increaseDislike }))
            setPost((prev) => increaseDislike)



            //Update In Profile
            let dislikedQuestions = [...dislikedQuestionsInContext]
            dislikedQuestions.push(post?.$id)

            let likedQuestions = likedQuestionsInContext.filter((likedPostIDs) => likedPostIDs !== post?.$id)
            const updateLikeArr_In_MyProfile = await profile.updateProfileWithQueries({ profileID: myUserProfile?.$id, likedQuestions, dislikedQuestions, bookmarks: bookmarksInContext })
            // console.log(updateLikeArr_In_MyProfile)
            setMyUserProfile((prev) => updateLikeArr_In_MyProfile)
          } else {

            const increaseDisLike = await appwriteService.updatePost_Like_DisLike({ postId: post?.$id, like: previousLike, dislike: previousDislike + 1 })
            // console.log(increaseLike)
            dispatch(getAllVisitedQuestionsInViewPost({ questions: increaseDisLike }))
            setPost((prev) => increaseDisLike)

            //Update In Profile
            let dislikedQuestions = [...dislikedQuestionsInContext]
            dislikedQuestions.push(post?.$id)
            // console.log(likedQuestions)
            const updateLikeArr_In_MyProfile = await profile.updateProfileWithQueries({ profileID: myUserProfile?.$id, likedQuestionsInContext, dislikedQuestions: dislikedQuestions, bookmarks: bookmarksInContext })
            // console.log(updateLikeArr_In_MyProfile)
            setMyUserProfile((prev) => updateLikeArr_In_MyProfile)
          }
        }
      } catch (error) {
        console.log("Error in Dislike")
      }

    } else {

      if (bookmarksInContext.includes(post?.$id)) {
        const removeBookmark = bookmarksInContext.filter((bookmarkPostID) => bookmarkPostID !== post?.$id)

        const updateBookMarkInProfile = await profile.updateProfileWithQueries({ profileID: myProfileID_In_Context, likedQuestions: likedQuestionsInContext, dislikedQuestions: dislikedQuestionsInContext, bookmarks: removeBookmark })
        setMyUserProfile((prev) => updateBookMarkInProfile)
        // console.log(newBookMarkArr)
      } else {
        let addBookmark = [...bookmarksInContext]
        addBookmark.push(post?.$id)
        // console.log(addBookmark)

        const updateBookMarkInProfile = await profile.updateProfileWithQueries({ profileID: myProfileID_In_Context, likedQuestions: likedQuestionsInContext, dislikedQuestions: dislikedQuestionsInContext, bookmarks: addBookmark })
        setMyUserProfile((prev) => updateBookMarkInProfile)
      }
    }
  }

  const ViewPostRef = useRef()
  const lastScrollY = useRef(window.scrollY);

  const [isNavbarHidden, setisNavbarHidden] = useState(false)
  // console.log(isNavbarHidden)
  const handleScroll = (e) => {
    // console.log('Hi')
    let position = e.target.scrollTop;
    // console.log('lastScrollY ' + lastScrollY.current)
    // console.log('position ' + position)
    sessionStorage.setItem('scrollPositionofViewPost', position.toString());
    if (lastScrollY.current < position) {
      // console.log('down')
      setisNavbarHidden(true)
    } else {
      // console.log('up')
      setisNavbarHidden(false)
    }
    // setlastScrollY(position)
    lastScrollY.current = position
  }

  useEffect(() => {
    //  console.log("Hi")
    if (ViewPostRef.current) {
      // console.log("HOme")
      const storedScrollPosition = sessionStorage.getItem('scrollPositionofViewPost');
      const parsedScrollPosition = parseInt(storedScrollPosition, 10);
      // console.log(parsedScrollPosition)
      ViewPostRef.current.scrollTop = parsedScrollPosition
    }
  }, [ViewPostRef.current]);
  return post ? (
    <div
      id="ViewPost_Scroll_Div"
      ref={ViewPostRef}
      className="w-full relative"
      onScroll={handleScroll}
    >
      <nav className={`Home_Nav_Container w-full text-center ${isNavbarHidden ? 'active' : ''}`}>
        <UpperNavigationBar className='' />
        <HorizontalLine />
        <LowerNavigationBar />
      </nav>
      <HorizontalLine />
      <div id="ViewPost_ViewPost_RecentQuestions_Container" className="flex">
        <div id="ViewPost" className="p-3">
          <div id="ViewPost-Question-Container" className="w-4/6 p-2 bg-white">
            <div id="ViewPost_Details" className="mb-3 flex justify-between mx-3 mt-1 relative items-center">

              <div className="flex">
                <div>
                  <span id="ViewPost-Category">{post?.category}</span>
                </div>
                <div id="ViewPost_Date_Views_comments" className="flex">
                  <div>
                    <span className="">{new Date(postdate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>{postViews}</span>
                    <i className=" fa-solid fa-eye"></i>
                  </div>
                  <div className="flex gap-2">
                    <span>{postCommentCount}</span>
                    <i className="fa-solid fa-comment"></i>
                  </div>

                </div>
              </div>

              <div
                id="ViewPost_Edit_Delete"
                onMouseOver={() => {
                  ellipsis_Vertical.current.classList.add("fa-flip");
                }}
                onMouseOut={() => {
                  ellipsis_Vertical.current.classList.remove("fa-flip");
                }}
                onClick={() => {
                  ViewPost_ellipsis_Vertical.current.classList.toggle("block");
                }}
              >
                {isAuther && <div id="ViewPost_edit_Delete" className="relative">

                  <div>
                    <div
                      className="ViewPost-ellipsis-Vertical"
                      ref={ViewPost_ellipsis_Vertical}
                    >
                      <ul>
                        {isAuther && (
                          <li
                            onClick={() => { navigate(`/EditQuestion/${post?.$id}`) }}
                          >
                            <Button
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </Button>
                          </li>
                        )}
                        {isAuther && (
                          <li>
                            <Button
                              onClick={() => {
                                deletePost();
                                deleteThumbnail();
                              }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </Button>
                          </li>
                        )}

                        {/* {!isAuther && (
      <li>
        <Button>Report</Button>
      </li>
    )} */}
                      </ul>
                    </div>
                    <Button>
                      <i
                        id="ViewPost_fa-ellipsis"
                        ref={ellipsis_Vertical}
                        className="fa-solid fa-ellipsis-vertical text-xl"
                      ></i>
                    </Button>
                  </div>
                </div>}
              </div>

            </div>
            <div id="ViewPost-Question" className="mt-3">
              <div className="flex gap-2 items-center">
                <div className="rounded-full">
                  <img
                    src={`${profileImgURL ? profileImgURL : NoProfile}`}
                    id="PostCard-profile-pic"
                    className="rounded-full"
                  />
                </div>
                <div id='ViewPostName'>
                  <h5>{post.name}</h5>
                </div>
              </div>

              <div className="mt-3 mb-2">
                <h2 id="ViewPost-Title" className="text-3xl font-bold">
                  {post.title}
                </h2>
              </div>

              <div id="ViewPost-parse">{parse(post?.content)}</div>

              {post.pollQuestion && <div id="ViewPost_Poll_Div">
                <h5>Poll </h5>
                <p>{post.pollQuestion}</p>
                <ul>
                  {post.pollOptions?.map((option, index) => {
                    // console.log(option)
                    let selectedOption;
                    let parsedOption = JSON.parse(option).option
                    // console.log(parsedOption)
                    let parsedVote = JSON.parse(option).vote
                    // console.log(parsedVote)
                    let individualPollVote = Math.floor(Number((JSON.parse(option)).vote))
                    // console.log(individualPollVote)
                    let VoterIDandVote = pollVotersAuthIDsAndVote.map((obj) => JSON.parse(obj))

                    if (VoterIDandVote.length === 0) {
                      selectedOption = -1
                    } else {
                      selectedOption = VoterIDandVote[0].optionNum
                      // console.log(selectedOption)
                    }
                    // console.log(x)
                    // console.log(pollVotersAuthIDsAndVote)

                    let percentage = (individualPollVote / totalPollVotes) * 100;
                    percentage = percentage.toFixed(0)
                    if (isNaN(percentage)) {
                      percentage = 0
                    }
                    // console.log(percentage)

                    return <li onClick={() => updatePoll(post.$id, index, parsedOption, parsedVote, userData.$id)} key={parsedOption}>
                      <div id="ViewPost_Poll_Option">{parsedOption}</div>
                      <div id="ViewPost_Overlay_Poll" className={`${index === selectedOption ? "active" : ''}`}>{percentage}%</div>
                    </li>
                  })}
                </ul>


                {isPollOpinionVisible && <div id="ViewPost_Poll_Answer">
                  <span>{post.pollAnswer}</span>
                </div>}
                <div className="flex gap-3 ViewPost_Total_Poll_Votes">
                  <span>Total Votes :</span>
                  <span>{totalPollVotes}</span>
                </div>

              </div>}
            </div>
          </div>

          <section id="ViewPost_Like_Dislike_BookMark">
            <div onClick={() => like_dislike_BookMark('Like')} className="ViewPost_Like_Dislike_BookMark_Div cursor-pointer">
              <Button>
                <span>{post?.like}</span>
                <i className="fa-solid fa-thumbs-up"></i>
              </Button>
            </div>

            <div onClick={() => like_dislike_BookMark('Dislike')} className="ViewPost_Like_Dislike_BookMark_Div cursor-pointer">
              <Button>
                <span>{post?.dislike}</span>
                <i className="fa-solid fa-thumbs-down"></i>
              </Button>
            </div>

            <div onClick={() => like_dislike_BookMark('BooKMark')} className="ViewPost_Like_Dislike_BookMark_Div cursor-pointer">
              <Button><i className={`fa-${isBookMarked ? 'solid' : 'regular'} fa-bookmark`}></i></Button>
            </div>

          </section>
          <div className="Chat w-4/6 mt-6">
            <Chat post={post} navigateToRelatedPost={navigateToRelatedPost} slug={slug} />
          </div>
        </div>
        <div className={`ViewPost_Related_Filter_Comment_Questions ${isNavbarHidden ? '' : 'active'}`}>
          <div id="ViewPost_RelatedQuestions">
            <p>{post?.category} Related :</p>
            {!isRelatedQueriesExist && <span className="">No Related Post is Available of {post?.category}</span>}

            {isRelatedQueriesExist && <ul>
              {relatedQueriesArr?.map((QuestionObj, index) => {
                return <li key={QuestionObj?.$id} onClick={() => navigateToRelatedPost(QuestionObj?.$id)} className="cursor-pointer">{QuestionObj?.title ? QuestionObj?.title : QuestionObj?.pollQuestion
                }</li>
              })}
            </ul>}
          </div>

          {(filterCommentID !== 'null' && filteredComment) && <div className={`ViewPost_Filtered_Comments`}>
            <p>Your Comment :</p>
            <div>
              <div className="flex justify-between ViewPost_Filtered_Comments_Name_Delete">
                <p>{filteredComment?.name}</p>
                {filteredComment.authid === userData.$id && <i onClick={() => {
                  deleteComments(filterCommentID)
                }} className="fa-solid fa-trash cursor-pointer"></i>}
              </div>
              <article>
                {parse(filteredComment?.commentContent)}
              </article>
            </div>
          </div>}
        </div>
      </div>
    </div >
  ) : <div className="">

    <nav className={`Home_Nav_Container w-full text-center ${isNavbarHidden ? 'active' : ''}`}>
      <UpperNavigationBar className='' />
      <HorizontalLine />
      <LowerNavigationBar />
    </nav>
    <p className="text-3xl text-black">Post is Not Available</p>
  </div>;
};

export default ViewPost;
