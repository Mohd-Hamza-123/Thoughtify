import React, { useEffect, useRef } from "react";
import "./Chat.css";
import NoProfile from '../../assets/NoProfile.png'
import { ChatRTE, Button, TextArea, Spinner } from "../index";
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
import { getAllVisitedQuestionsInViewPost } from "../../store/ViewPostsSlice";

const Chat = ({ post, navigateToRelatedPost, slug }) => {
  // console.log(post.commentCount)
  // console.log(post)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const commentsInRedux = useSelector((state) => state.commentsSlice.comments)
  const postUploaderPics = useSelector((state) => state.postsSlice.postUploaderProfilePic)
  // console.log(post)
  // console.log(commentsInRedux)

  // load subcomments
  const fixedReplies = 2;
  const [loadSubComments_Five_Mul, setloadSubComments_Five_Mul] = useState(2)
  const [id_For_Five_Mul, setid_For_Five_Mul] = useState(null)
  const [arr_For_Five_Mul, setarr_For_Five_Mul] = useState([])
  const [activeTextArea, setactiveTextArea] = useState(null)

  const [postCommentCount, setpostCommentCount] = useState(null)
  // console.log(postCommentCount)
  const [postid, setpostid] = useState(post.$id);
  const [commentArr, setcommentArr] = useState([]);
  // console.clear()
  // console.log(commentArr)
  const [replyComment, setreplyComment] = useState("");
  const { $id: authid, name } = useSelector((state) => state.auth.userData)
  const { register, watch, control, handleSubmit, setValue, getValues, reset } =
    useForm();
  // intersection observer
  const [isLoading, setIsLoading] = useState(false)
  const { hasMoreComments, sethasMoreComments } = useAskContext()
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [lastPostID, setLastPostID] = useState(null);
  // console.log(lastPostID)

  // console.log(totalComments)

  let spinnerRef = useRef();
  // let see = document.querySelector('#tinymce')
  // console.log(see)


  useEffect(() => {
    // console.log("hi")
    const getProfilePics = async () => {
      // console.log(commentArr)
      let array = commentArr;
      let uniqueArray = Array.from(new Map(array.map(obj => [obj.authid
        , obj])).values());
      // console.log(uniqueArray)
      // console.log(postUploaderPics)
      let wantProfileIds = uniqueArray.filter((objofUniqueArr) => {
        return !postUploaderPics.some((objOfRedux) => objOfRedux.userId === objofUniqueArr.authid)
      })
      // console.log(wantProfileIds)
      if (wantProfileIds.length > 0) {
        for (let i = 0; i < wantProfileIds.length; i++) {
          let listedProfile = await profile.listProfile({ slug: wantProfileIds[i].authid })

          let userId = listedProfile.documents[0].userIdAuth
          let profilePic = listedProfile.documents[0].profileImgURL
          dispatch(getpostUploaderProfilePic({ userId, profilePic }))
        }
      }
    }
    if (commentArr.length > 0) {
      getProfilePics()
    }
  }, [])

  const getComments = async (lastid = null) => {
    try {
      setIsLoading(true)
      const comments = await realTime.listComment(post?.$id, lastid);
      // console.log(comments)

      if (commentArr.length < comments.total) {
        sethasMoreComments(true)
      } else {
        sethasMoreComments(false)
      }
      dispatch(getCommentsInRedux({ comments: comments.documents, isMerge: true }))
    } catch (error) {
      setcommentArr((prev) => {
        const arr = commentsInRedux.filter((comment) => comment.postid === post.$id)
        // console.log(arr)
        if (arr.length !== 0) setLastPostID(arr[arr.length - 1].$id)
        // console.log(arr[arr.length - 1].$id)
        if (arr.length !== 0) {
          return arr
        } else {
          return []
        }
      })
      setIsLoading(false)
    } finally {
      // setIsLoading(false)
    }
  };

  useEffect(() => {
    // console.log("HI")
    setcommentArr((prev) => {
      const arr = commentsInRedux.filter((comment) => comment.postid === post.$id)
      // console.log(arr)
      if (arr.length !== 0) setLastPostID(arr[arr.length - 1].$id)
      // console.log(arr[arr.length - 1].$id)
      return arr
    })

  }, [isIntersecting,post,slug,commentsInRedux])

  useEffect(() => {

    if (isIntersecting) {
      // console.log(lastPostID)
      getComments(lastPostID)
    }
  }, [isIntersecting])


  useEffect(() => {
    // console.log("HI")
    getComments();
  }, [slug,post]);

  useEffect(() => {
    const ref = spinnerRef.current;
    // console.log(ref)
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
    clearEditorContent()
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Adding 
    const day = ('0' + currentDate.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;



    if (!data.commentContent) return
    if (post) {
      const dbCommnet = await realTime.createComment({
        ...data,
        postid,
        authid,
        name,
        category: post?.category,
        date: formattedDate,
      });
      // setcommentArr((prev) => [dbCommnet, ...prev]);
      dispatch(getCommentsInRedux({ comments: [dbCommnet], isMerge: null }))
      // console.log(dbCommnet)
    }

    if (postCommentCount || postCommentCount === 0) {
      console.log("PostCommentCount A")
      appwriteService.updatePostViews(postid, post.views, postCommentCount + 1)
        .then((res) => {
          setpostCommentCount((prev) => prev + 1)
          console.log(res)
          dispatch(getInitialPost({ initialPosts: [res] }))
        })
        .catch((error) => console.log(error))
    } else {
      console.log("PostCommentCount B")
      appwriteService.updatePostViews(postid, post.views, post.commentCount + 1)
        .then((res) => {
          setpostCommentCount((prev) => post.commentCount + 1)
          console.log(res)
          // dispatch(getAllVisitedQuestionsInViewPost({ questions: res }))
          dispatch(getInitialPost({ initialPosts: [res] }))
        })
        .catch((error) => console.log(error))
    }
  };
  const CommentReply = (
    subComment,
    messageid,
    commentContent,
    postid,
    index
  ) => {
    let copiedSubComment = [...subComment]
    if (index || index === 0) {
      // console.log(index)
      // console.log(subComment)

      // console.log(copiedSubComment)
      copiedSubComment.splice(index, 1);
      // subComment.splice(index, 1);
      // console.log(copiedSubComment);
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
        // console.log("dispatched")
        dispatch(getCommentsInRedux({ comments: commentsAfterDeletion, isMerge: false }))
      })
      .catch((err) => console.log(err.message));

    if (postCommentCount) {
      // console.log("PostCommentCount C")
      appwriteService
        .updatePostViews(postid, post.views, postCommentCount - 1)
        .then((res) => {
          dispatch(getInitialPost({ initialPosts: [res] }))
          setpostCommentCount((prev) => prev - 1)
          // console.log(res)
        })
        .catch((error) => console.log(error))
    } else {
      console.log("PostCommentCount D")
      appwriteService
        .updatePostViews(postid, post.views, post.commentCount - 1)
        .then((res) => {
          dispatch(getInitialPost({ initialPosts: [res] }))
          setpostCommentCount((prev) => post.commentCount - 1)
          // console.log(res)
        })
        .catch((error) => console.log(error))
    }
  }

  useEffect(() => {
    if (commentArr) {
      if (commentArr.length !== 0) {
        for (let i = 0; i < commentArr.length; i++) {
          setarr_For_Five_Mul((prev) => [...prev, { subCommentID: commentArr[i]?.$id, five_Multiple: 1 }])
        }
      }
    }
  }, [commentArr])

  const editorRef = useRef(null)
  const clearEditorContent = () => {
    if (editorRef.current) {
      editorRef.current.setContent('');
    }
  }

  return (
    <div id="Chat">
      <form onSubmit={handleSubmit(Submit)}>
        <div >
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

          // console.log(profilePicURL)
          return <div key={comment?.$id} id="Chat_Comment_Div">
            <section>
              <div className="flex justify-between mb-5">

                <div className="flex gap-2">
                  <img
                    id="Chat_Comment_Div_img"
                    src={`${profilePicURL ? profilePicURL : NoProfile}`}
                    alt=""
                  />
                  <span className="text-red-700 font-bold Chat_Comment_Name">{comment?.name}</span>
                </div>
                <div>
                  {authid === comment?.authid && (
                    <span
                      onClick={() => {
                        deleteComments(comment?.$id);
                      }}
                      className="cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can text-xl"></i>
                    </span>
                  )}
                </div>

              </div>

              <div id="Chat_Comment_Div_1">
                <div id="Chat_Comment">{comment?.commentContent ? parse(comment?.commentContent) : ''}</div>
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

                // console.log(id_For_Five_Mul)
                if (comment?.$id != id_For_Five_Mul) {
                  if (index >= fixedReplies) return
                } else {
                  if (index >= loadSubComments_Five_Mul) return
                }
                return <div
                  key={sub + index + Date.now()}
                  className="Chat_SubComments_Div relative"
                >
                  {authid === JSON.parse(sub).authid && (
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
            <button className={''} id="Chat_See_Replies" onClick={() => {

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
