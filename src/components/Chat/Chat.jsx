import React, { useEffect, useRef } from "react";
import "./Chat.css";
import NoProfile from '../../assets/NoProfile.png'
import { ChatRTE, Button, Spinner } from "../index";
import { useForm } from "react-hook-form";
import realTime from "../../appwrite/realTime";
import parse from "html-react-parser";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import appwriteService from "../../appwrite/config";
import { useNavigate } from 'react-router-dom'
import { useAskContext } from "../../context/AskContext";
import { getCommentsInRedux } from "../../store/commentsSlice";
import profile from "../../appwrite/profile";
import { getInitialPost, getpostUploaderProfilePic } from "../../store/postsSlice";
import notification from "../../appwrite/notification";
import conf from "../../conf/conf";

const Chat = ({ post, slug }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const commentsInRedux = useSelector((state) => state?.commentsSlice?.comments);
  const userAuthStatus = useSelector((state) => state?.auth?.status)
  const postUploaderPics = useSelector((state) => state?.postsSlice?.postUploaderProfilePic);
  const userData = useSelector((state) => state?.auth?.userData)


  const fixedReplies = 2;
  const [loadSubComments_Five_Mul, setloadSubComments_Five_Mul] = useState(2)
  const [id_For_Five_Mul, setid_For_Five_Mul] = useState(null)

  const [activeTextArea, setactiveTextArea] = useState(null)

  const [postCommentCount, setpostCommentCount] = useState(null)

  const [postid, setpostid] = useState(post?.$id);
  const [commentArr, setcommentArr] = useState([]);

  const [replyComment, setreplyComment] = useState("");
  const { $id: authid, name } = useSelector((state) => state.auth?.userData || {});
  const { control, handleSubmit, getValues } =
    useForm();

  const [isLoading, setIsLoading] = useState(false)
  const { hasMoreComments, sethasMoreComments, setnotificationPopMsg, setNotificationPopMsgNature, myUserProfile, isDarkModeOn } = useAskContext()
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [lastPostID, setLastPostID] = useState(null);


  let spinnerRef = useRef();

  useEffect(() => {

    const getProfilePics = async () => {

      let array = commentArr;
      let uniqueArray = Array.from(new Map(array?.map(obj => [obj?.authid
        , obj])).values());

      let wantProfileIds = uniqueArray.filter((objofUniqueArr) => {
        return !postUploaderPics.some((objOfRedux) => objOfRedux?.userId === objofUniqueArr?.authid)
      })
      
      if (wantProfileIds.length > 0) {
        for (let i = 0; i < wantProfileIds.length; i++) {
          let listedProfile = await profile.listProfile({ slug: wantProfileIds[i].authid })

          let userId = listedProfile?.documents[0].userIdAuth
          let profilePic = listedProfile?.documents[0].profileImgURL
          dispatch(getpostUploaderProfilePic({ userId, profilePic }))
        }
      }
    }
    if (commentArr?.length > 0) {
      getProfilePics();
    }
  }, [commentArr])

  const getComments = async (lastid = null) => {
    try {
      setIsLoading(true)
      const comments = await realTime.listComment(post?.$id, lastid);

      if (commentArr?.length < comments?.total) {
        sethasMoreComments(true)
      } else {
        sethasMoreComments(false)
      }
      dispatch(getCommentsInRedux({ comments: comments?.documents, isMerge: true }))
    } catch (error) {
      setcommentArr((prev) => {
        const arr = commentsInRedux?.filter((comment) => comment?.postid === post?.$id)

        if (arr?.length !== 0) setLastPostID(arr[arr?.length - 1]?.$id)

        if (arr?.length !== 0) {
          return arr
        } else {
          return []
        }
      })
      setIsLoading(false)
    }
  };

  useEffect(() => {
    setcommentArr((prev) => {
      const arr = commentsInRedux?.filter((comment) => comment?.postid === post?.$id)
      if (arr?.length !== 0) setLastPostID(arr[arr?.length - 1]?.$id)
      return arr
    })

  }, [isIntersecting, post, slug, commentsInRedux])

  useEffect(() => {

    if (isIntersecting) {
      getComments(lastPostID)
    }
  }, [isIntersecting])


  useEffect(() => {
    getComments();
  }, [slug, post]);

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

  }, [spinnerRef.current, commentArr])

  const Submit = async (data) => {

    clearEditorContent();
    if (!userAuthStatus) {
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg((prev) => 'Please Login')
      return
    }

    if (!data.commentContent) return
    if (post) {

      if (post?.opinionsFrom === 'Responders' && myUserProfile?.trustedResponder !== true) {
        setNotificationPopMsgNature((prev) => false);
        setnotificationPopMsg((prev) => 'Only Responders can Comment on this post.')
        return
      }

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      const day = ('0' + currentDate.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;

      try {
        const dbCommnet = await realTime.createComment({
          ...data,
          postid,
          authid,
          name,
          category: post?.category,
          date: formattedDate,
        });

        dispatch(getCommentsInRedux({ comments: [dbCommnet], isMerge: null }))

        setNotificationPopMsgNature((prev) => true)
        setnotificationPopMsg((prev) => 'Comment Posted')

        if (authid !== post?.userId) {
          // Getting Post Uploader profile to know whether he follows you or not.
          const getPostUploaderProfile = await profile.listProfile({ slug: post?.userId });

          console.log(getPostUploaderProfile);
          let followersArr = getPostUploaderProfile.documents[0].followers
          followersArr = followersArr?.map((obj) => JSON.parse(obj))
          console.log(followersArr)
          const isNotificationSend = followersArr?.findIndex((profile) => profile.profileID === authid);

          // If He follows you , notification will be sent
          if (isNotificationSend !== -1) {
            const createNotification = await notification.createNotification({ content: `${name} has commented on your post.`, isRead: false, slug: `/post/${post?.$id}/${dbCommnet?.$id}`, name, userID: authid, postID: post.$id, userIDofReceiver: post?.userId, userProfilePic: myUserProfile?.profileImgURL });
          }
        }

        if (postCommentCount || postCommentCount === 0) {

          appwriteService.updatePostViews(postid, post.views, postCommentCount + 1)
            .then((res) => {
              setpostCommentCount((prev) => prev + 1)
              console.log(res)
              dispatch(getInitialPost({ initialPosts: [res] }))
            })
            .catch((error) => console.log(error))
        } else {

          appwriteService.updatePostViews(postid, post.views, post.commentCount + 1)
            .then((res) => {
              setpostCommentCount((prev) => post.commentCount + 1)
              dispatch(getInitialPost({ initialPosts: [res] }))
            })
            .catch((error) => console.log(error))
        }
      } catch (error) {
        setNotificationPopMsgNature((prev) => false)
        setnotificationPopMsg((prev) => 'Comment not Posted')
      }

    }
  };
  const CommentReply = (
    subComment,
    messageid,
    commentContent,
    postid,
    index
  ) => {

    if (!userAuthStatus) {
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg((prev) => 'Please Login')
      return
    }

    let copiedSubComment = [...subComment]
    if (index || index === 0) {

      copiedSubComment.splice(index, 1);

    }
    realTime
      .updateComment(
        {
          messageid,
          postid,
          commentContent,
          authid,
        },
        copiedSubComment
      )
      .then((res) => {
        getComments();
      });
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
        .updatePostViews(postid, post.views, postCommentCount - 1)
        .then((res) => {
          dispatch(getInitialPost({ initialPosts: [res] }))
          setpostCommentCount((prev) => prev - 1)

        })
        .catch((error) => console.log(error))
    } else {
      appwriteService
        .updatePostViews(postid, post.views, post.commentCount - 1)
        .then((res) => {
          dispatch(getInitialPost({ initialPosts: [res] }))
          setpostCommentCount((prev) => post.commentCount - 1)

        })
        .catch((error) => console.log(error))
    }
  }


  const editorRef = useRef(null)
  const clearEditorContent = () => {
    if (editorRef.current) {
      editorRef.current.setContent('');
    }
  }

  return (
    <div id="Chat">
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
        {commentArr?.map((comment) => {

          let profilePicIndex = postUploaderPics.findIndex((obj) => (obj.userId === comment.authid));

          let profilePicURL;
          if (profilePicIndex !== -1) {
            profilePicURL = postUploaderPics[profilePicIndex].profilePic
          }

          return <div key={comment?.$id} className="Chat_Comment_Div">
            <section>
              <div className="flex justify-between">

                <div onClick={() => navigate(`/profile/${comment?.authid}`)} className="flex gap-2 cursor-pointer">
                  <img
                    className="Chat_Comment_Div_img"
                    src={`${profilePicURL ? profilePicURL : NoProfile}`}
                    alt=""
                  />
                  <span className="font-bold Chat_Comment_Name">{comment?.name}</span>
                </div>
                <div>
                  {(authid === comment?.authid || userData?.$id === conf.myPrivateUserID || userData?.$id === post?.userId) && (
                    <span
                      onClick={() => {
                        deleteComments(comment?.$id);
                      }}
                      className="cursor-pointer"
                    >
                      <i className={`fa-solid fa-trash-can text-xl ${isDarkModeOn ? 'text-white' : 'text-black'}`}></i>
                    </span>
                  )}
                </div>

              </div>

              <div className="Chat_Comment_Div_1">
                <div className="Chat_Comment">{comment?.commentContent ? parse(comment?.commentContent) : ''}</div>
              </div>
            </section>

            <div id="ReplyDiv" className="flex justify-end mt-3">
              <span
                className="cursor-pointer"
                onClick={() => {
                  setactiveTextArea((prev) => comment?.$id)
                }}
              >
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
                onChange={(e) => setreplyComment(e.target.value)}
              ></textarea>

              <Button
                onClick={() => {
                  if (comment?.subComment?.length > 100) return
                  CommentReply(
                    [
                      JSON.stringify({
                        sub: replyComment,
                        authid: authid,
                        name: name,
                      }),
                      ...comment?.subComment,
                    ],
                    comment?.$id,
                    comment?.commentContent,
                    post?.$id,
                    null
                  );
                  setreplyComment((prev) => '')
                }}
                className="Chat-Comment-Reply"
                value="Submit"
                type="submit"
              >
                Submit
              </Button>
            </div>


            <div className={``}>
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
                  {(authid === JSON.parse(sub).authid || userData?.$id === conf.myPrivateUserID || userData?.$id === post?.userId) && (
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
                  <span className="cursor-pointer" onClick={() => navigate(`/profile/${JSON.parse(sub)?.authid}`)}>{JSON.parse(sub)?.name}</span>
                  <p>{JSON.parse(sub)?.sub}</p>

                </div>
              })}
            </div>
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
