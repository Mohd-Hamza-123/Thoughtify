import "./Chat.css";
import { useState } from "react";
import conf from "../../conf/conf";
import { Button } from "../ui/button";
import parse from "html-react-parser";
import { useForm } from "react-hook-form";
import profile from "../../appwrite/profile";
import realTime from "../../appwrite/realTime";
import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChatRTE, Icons, Spinner } from "../index";
import appwriteService from "../../appwrite/config";
import notification from "../../appwrite/notification";
import { useSelector, useDispatch } from "react-redux";
import { useAskContext } from "../../context/AskContext";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useNotificationContext } from "@/context/NotificationContext";

const Chat = () => {

  const { slug, filterCommentID } = useParams();
  // console.log(slug)
  // console.log(filterCommentID)

  const {
    data: comments
  } = useQuery({
    queryKey: ['comments', slug],
    queryFn: async () => {
      const data = await realTime.listComment(slug);
      return data.documents
    }
  })

  // console.log(comments)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authStatus = useSelector((state) => state?.auth?.status)
  const userData = useSelector((state) => state?.auth?.userData)
  const profileData = useSelector((state) => state?.profileSlice?.userProfile)
  const commentsInRedux = useSelector((state) => state?.commentsSlice?.comments);

  const { setNotification } = useNotificationContext()

  const fixedReplies = 2;

  const [loadSubComments_Five_Mul, setloadSubComments_Five_Mul] = useState(2)
  const [id_For_Five_Mul, setid_For_Five_Mul] = useState(null)

  const [activeTextArea, setactiveTextArea] = useState(null)

  const [postCommentCount, setpostCommentCount] = useState(null)

  const [replyComment, setReplyComment] = useState("");
  const { $id: authId, name } = useSelector((state) => state.auth?.userData || {});
  const { control, handleSubmit, getValues } =
    useForm();

  const [isLoading, setIsLoading] = useState(false)
  const { hasMoreComments, sethasMoreComments } = useAskContext()

  const [isIntersecting, setIsIntersecting] = useState(false)
  const [lastpostId, setLastpostId] = useState(null);


  let spinnerRef = useRef();

  // useEffect(() => {

  //   const getProfilePics = async () => {

  //     let array = commentArr;
  //     let uniqueArray = Array.from(new Map(array?.map(obj => [obj?.authId
  //       , obj])).values());

  //     let wantProfileIds = uniqueArray.filter((objofUniqueArr) => {
  //       return !postUploaderPics.some((objOfRedux) => objOfRedux?.userId === objofUniqueArr?.authId)
  //     })

  //     if (wantProfileIds.length > 0) {
  //       for (let i = 0; i < wantProfileIds.length; i++) {
  //         let listedProfile = await profile.listProfile({ slug: wantProfileIds[i].authId })

  //         let userId = listedProfile?.documents[0]?.userIdAuth
  //         let profilePic = listedProfile?.documents[0]?.profileImgURL
  //         dispatch(getpostUploaderProfilePic({ userId, profilePic }))
  //       }
  //     }
  //   }
  //   if (commentArr?.length > 0) {
  //     getProfilePics();
  //   }
  // }, [commentArr])

  // const getComments = async (lastid = null) => {
  //   try {
  //     setIsLoading(true)
  //     const comments = await realTime.listComment(post?.$id, lastid);

  //     if (commentArr?.length < comments?.total) {
  //       sethasMoreComments(true)
  //     } else {
  //       sethasMoreComments(false)
  //     }
  //     dispatch(getCommentsInRedux({ comments: comments?.documents, isMerge: true }))
  //   } catch (error) {
  //     setcommentArr((prev) => {
  //       const arr = commentsInRedux?.filter((comment) => comment?.postId === post?.$id)

  //       if (arr?.length !== 0) setLastpostId(arr[arr?.length - 1]?.$id)

  //       if (arr?.length !== 0) {
  //         return arr
  //       } else {
  //         return []
  //       }
  //     })
  //     setIsLoading(false)
  //   }
  // };

  const deletePostComments = async () => {
    if (!authStatus) {
      setNotification({ message: "Please Login", type: 'error' })
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

  // useEffect(() => {
  //   setcommentArr((prev) => {
  //     const arr = commentsInRedux?.filter((comment) => comment?.postId === post?.$id)
  //     if (arr?.length !== 0) setLastpostId(arr[arr?.length - 1]?.$id)
  //     return arr
  //   })

  // }, [isIntersecting, slug, commentsInRedux])

  useEffect(() => {

    if (isIntersecting) {
      getComments(lastpostId)
    }
  }, [isIntersecting])


  useEffect(() => {
    const ref = spinnerRef.current;

    if (ref) {
      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting((prev) => entry.isIntersecting)
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 1
      })

      observer.observe(ref)
      return () => ref && observer.unobserve(ref)
    }

  }, [spinnerRef.current])

  const deleteComment = async (documentid) => {
    realTime
      .deleteComment(documentid)
      .then(() => {
        let commentsAfterDeletion = commentsInRedux.filter(
          (comment) => comment.$id !== documentid
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


  const Submit = async (data) => {

    clearEditorContent();

    if (!authStatus) {
      setNotification({ message: "Please Login", type: 'error' })
      return
    }

    if (!data.commentContent) {
      setNotification({ message: "Comment not posted", type: 'error' })
      return
    }

    try {


      const post = await appwriteService.getPost(slug)

      if (post?.opinionsFrom === 'Responders' && profileData?.trustedResponder && post?.userId !== userData?.$id) {
        setNotification({ message: "Only Responders can Comment on this post.", type: 'error' })
        return
      }

      // console.log(post)
      // console.log(data)

      const dbCommnet = await realTime.createComment({
        ...data,
        postId: post?.$id,
        authId,
        name,
        category: post?.category,
      });
      console.log(dbCommnet)

      setNotification({ message: "Comment Posted", type: 'success' })

      return

      setTimeout(() => {
        let newComment = document.getElementById(`Comment${dbCommnet?.$id}`)
        console.log(newComment)
        if (newComment) {
          newComment.focus()
        }
      }, 1000);


      if (authId !== post?.userId) {
        // Getting Post Uploader profile to know whether he follows you or not.
        const getPostUploaderProfile = await profile.listProfile({ slug: post?.userId });


        let followersArr = getPostUploaderProfile?.documents[0]?.followers
        followersArr = followersArr?.map((obj) => JSON.parse(obj))

        const isNotificationSend = followersArr?.findIndex((profile) => profile.profileID === authId);

        // If He follows you , notification will be sent
        if (isNotificationSend !== -1) {
          const createNotification = await notification.createNotification({ content: `${name} has commented on your post.`, isRead: false, slug: `/post/${post?.$id}/${dbCommnet?.$id}`, name, userID: authId, postId: post.$id, userIDofReceiver: post?.userId, userProfilePic: myUserProfile?.profileImgURL });
        }
      }

      if (postCommentCount || postCommentCount === 0) {

        appwriteService.updatePostViews(postId, post.views, postCommentCount + 1)
          .then((res) => {
            setpostCommentCount((prev) => prev + 1)
            console.log(res)
            dispatch(getInitialPost({ initialPosts: [res] }))
          })
          .catch((error) => console.log(error))
      } else {

        appwriteService.updatePostViews(postId, post.views, post.commentCount + 1)
          .then((res) => {
            setpostCommentCount((prev) => post.commentCount + 1)
            dispatch(getInitialPost({ initialPosts: [res] }))
          })
          .catch((error) => console.log(error))
      }
    } catch (error) {
      console.log(error)
      setNotification({ message: "Comment not Posted", type: 'error' })
    }

  };

  const deleteComments = async (documentid) => {

    realTime
      .deleteComment(documentid)
      .then(() => {

        let commentsAfterDeletion = commentsInRedux.filter((comment) => comment.$id !== documentid)

        dispatch(getCommentsInRedux({ comments: commentsAfterDeletion, isMerge: false }))
        setNotificationPopMsgNature((prev) => true)
        setnotificationPopMsg((prev) => 'Comment Deleted')
      })
      .catch((err) => console.log(err.message));

    if (postCommentCount) {

      appwriteService
        .updatePostViews(postId, post.views, postCommentCount - 1)
        .then((res) => {
          dispatch(getInitialPost({ initialPosts: [res] }))
          setpostCommentCount((prev) => prev - 1)

        })
        .catch((error) => console.log(error))
    } else {
      appwriteService
        .updatePostViews(postId, post.views, post.commentCount - 1)
        .then((res) => {
          dispatch(getInitialPost({ initialPosts: [res] }))
          setpostCommentCount((prev) => post.commentCount - 1)

        })
        .catch((error) => console.log(error))
    }
  }

  const subComment = (data) => {

    if (!authStatus) {
      setNotification({ message: "Please Login", type: 'error' })
      return
    }
    const { subComment, userId, username } = data

    if (subComment?.length > 100) {
      setNotification({ message: "You can't add more than 100 replies.", type: 'error' })
      return
    }

    const newPayload = JSON.stringify({
      comment: replyComment,
      userId,
      username,
    })

    subComment.push(newPayload)

    console.log(subComment)


    setReplyComment((prev) => '')
  }

  const editorRef = useRef(null)
  const clearEditorContent = () => {
    if (editorRef.current) {
      editorRef.current.setContent('');
    }
  }

  return (
    <div className="w-full md:w-[70%] px-3 py-3">
      <form onSubmit={handleSubmit(Submit)}>
        <div className="">
          <ChatRTE
            control={control}
            name="commentContent"
            defaultValue={getValues("commentContent")}
            editorRef={editorRef}
            clearEditorContent={clearEditorContent}
          />
        </div>
        <div className="flex justify-end mt-3">
          <Button
            id='Chat_Your_Opinion_Button'
            type="submit"
            className="border-1 p-2 rounded-md"
          >
            Give Opinion
          </Button>
        </div>
      </form>

      <div>
        {comments?.map((comment) => {
          // console.log(comment)
          const profilePicURL = 'https://images.pexels.com/photos/33029806/pexels-photo-33029806.jpeg'

          return <div key={comment?.$id} className="Chat_Comment_Div">
            <section>
              <div className="flex justify-between">

                <Link
                  to={`/profile/${comment?.authId}`}
                  id={`Comment${comment?.$id}`}>
                  <div className="flex gap-2 cursor-pointer">
                    <img
                      className="Chat_Comment_Div_img"
                      src={profilePicURL}
                      alt="profilePic"
                    />
                    <span className="font-bold Chat_Comment_Name">{comment?.name}</span>
                  </div>
                </Link>
                <div>
                  {(authId === comment?.authId || userData?.$id === conf.myPrivateUserID || userData?.$id === post?.userId) && (
                    <span
                      onClick={() => deleteComments(comment?.$id)}
                      className="cursor-pointer">
                      <Icons.trashcan />
                    </span>
                  )}
                </div>

              </div>


              <div className="Chat_Comment">
                {comment?.commentContent ? parse(comment?.commentContent) : ''}</div>

            </section>

            <div id="ReplyDiv" className="flex justify-end mt-3">
              <span
                className="cursor-pointer"
                onClick={() => setactiveTextArea((prev) => comment?.$id)}>
                Reply
              </span>
            </div>


            <div className={`${activeTextArea === comment?.$id ? '' : 'hidden'}`}>
              <textarea
                name=""
                id={`id_${comment?.$id}`}
                rows="4"
                value={replyComment}
                className="Chat_textArea"
                onChange={(e) => setReplyComment(e.target.value)}
              ></textarea>

              <Button
                onClick={() => subComment({
                  subComment: comment?.subComment,
                  userId: userData?.$id,
                  username: name,
                })}
                className="Chat-Comment-Reply"
                value="Submit"
                type="submit">
                Submit
              </Button>
            </div>


            {/* <div>
              {comment?.subComment?.map((sub, index) => {

                if (comment?.$id != id_For_Five_Mul) {
                  if (index >= fixedReplies) return
                } else {
                  if (index >= loadSubComments_Five_Mul) return
                }
                return <div
                  key={sub + index + Date.now()}
                  className="Chat_SubComments_Div relative"
                >
                  {(authId === JSON.parse(sub).authId || userData?.$id === conf.myPrivateUserID || userData?.$id === post?.userId) && (
                    <button
                      className=""
                      onClick={() => {
                        CommentReply(
                          comment?.subComment,
                          comment?.$id,
                          comment?.commentContent,
                          post?.$id,
                          index
                        );
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                  <span className="cursor-pointer" onClick={() => navigate(`/profile/${JSON.parse(sub)?.authId}`)}>{JSON.parse(sub)?.name}</span>
                  <p>{JSON.parse(sub)?.sub}</p>

                </div>
              })}
            </div> */}
            <button className="Chat_See_Replies"
              onClick={() => {

                setid_For_Five_Mul((prev) => comment?.$id)
                const currentCommentID = comment?.$id;
                if (currentCommentID !== id_For_Five_Mul && id_For_Five_Mul !== null) {
                  setloadSubComments_Five_Mul((prev) => fixedReplies + 2)
                }
                if (loadSubComments_Five_Mul >= comment?.subComment?.length) return

                setloadSubComments_Five_Mul((prev) => prev + 3)

              }}>{`${(loadSubComments_Five_Mul >= comment?.subComment?.length && comment?.$id === id_For_Five_Mul) || comment?.subComment?.length <= fixedReplies ? 'No Replies' : 'See Replies'}`}</button>
            <div>
              <small>{new Date(comment?.$createdAt).toLocaleString()}</small>
            </div>
          </div>
        })}
      </div>

      {(isLoading && hasMoreComments) && < div className="flex justify-center" ref={spinnerRef}>
        <Spinner />
      </div>}

    </div >
  );
};

export default Chat;
