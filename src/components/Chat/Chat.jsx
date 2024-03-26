import React, { useEffect, useRef } from "react";
import "./Chat.css";
import { ChatRTE, Button, TextArea } from "../index";
import { useForm } from "react-hook-form";
import realTime from "../../appwrite/realTime";
import parse from "html-react-parser";
import { useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";
import { useNavigate } from 'react-router-dom'

const Chat = ({ post }) => {
  const navigate = useNavigate()
  // load subcomments
  const fixedReplies = 2;
  const [loadSubComments_Five_Mul, setloadSubComments_Five_Mul] = useState(2)
  // console.log(loadSubComments_Five_Mul)
  // console.log(loadSubComments_Five_Mul)
  // console.log(loadSubComments_Five_Mul)
  const [id_For_Five_Mul, setid_For_Five_Mul] = useState(null)
  const [arr_For_Five_Mul, setarr_For_Five_Mul] = useState([])
  // console.log(arr_For_Five_Mul)
  const [activeTextArea, setactiveTextArea] = useState(null)


  const [postCommentCount, setpostCommentCount] = useState(null)
  // console.log(postCommentCount)
  const [postid, setpostid] = useState(post.$id);
  const [commentArr, setcommentArr] = useState([]);
  const [replyComment, setreplyComment] = useState("");
  const { $id: authid, name } = useSelector((state) => state.auth.userData);
  const userProfile = useSelector((state) => state.profileSlice.userProfile)
  // console.log(commentArr)
  const { register, watch, control, handleSubmit, setValue, getValues } =
    useForm();

  const getComments = async (lastid, firstid) => {
    const list_Comment = await realTime.listComment(postid, lastid, firstid);
    if (list_Comment) {
      setcommentArr(list_Comment.documents);
    }
  };
  const Submit = async (data) => {
    setValue('commentContent', '');
    if (!data.commentContent) return
    if (post) {
      const dbCommnet = await realTime.createComment({
        ...data,
        postid,
        authid,
        name,
        gender: userProfile.gender
      });
      setcommentArr((prev) => [dbCommnet, ...prev]);
    }

    if (postCommentCount || postCommentCount === 0) {
      console.log("PostCommentCount A")
      appwriteService.updatePostViews(postid, post.views, postCommentCount + 1)
        .then((res) => {
          setpostCommentCount((prev) => prev + 1)
          // console.log(res)
        })
        .catch((error) => console.log(error))
    } else {
      console.log("PostCommentCount B")
      appwriteService.updatePostViews(postid, post.views, post.commentCount + 1)
        .then((res) => {
          setpostCommentCount((prev) => post.commentCount + 1)
          // console.log(res)
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
    if (index || index === 0) {
      subComment.splice(index, 1);
      // console.log(subComment);
    }
    realTime
      .updateComment(
        {
          messageid,
          postid,
          commentContent,
          authid,
        },
        subComment
      )
      .then((res) => {
        getComments();
      });
  };
  const deleteComments = async (documentid) => {
    realTime
      .deleteComment(documentid)
      .then((res) => getComments())
      .catch((err) => console.log(err.message));

    if (postCommentCount) {
      console.log("PostCommentCount C")
      appwriteService
        .updatePostViews(postid, post.views, postCommentCount - 1)
        .then((res) => {
          setpostCommentCount((prev) => prev - 1)
          // console.log(res)
        })
        .catch((error) => console.log(error))
    } else {
      console.log("PostCommentCount D")
      appwriteService
        .updatePostViews(postid, post.views, post.commentCount - 1)
        .then((res) => {
          setpostCommentCount((prev) => post.commentCount - 1)
          // console.log(res)
        })
        .catch((error) => console.log(error))
    }
  }
  useEffect(() => {
    if (commentArr.length !== 0) {
      for (let i = 0; i < commentArr.length; i++) {
        setarr_For_Five_Mul((prev) => [...prev, { subCommentID: commentArr[i].$id, five_Multiple: 1 }])
      }
    }
  }, [commentArr])
  useEffect(() => {
    getComments();
  }, []);

  return (
    <div id="Chat">
      <form onSubmit={handleSubmit(Submit)}>
        <div >
          <ChatRTE
            control={control}
            name="commentContent"
            defaultValue={getValues("commentContent")}
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
        {commentArr?.map((comment) => (
          <div key={comment.$id} id="Chat_Comment_Div">
            <section>
              <div className="flex justify-between mb-5">

                <div className="flex gap-2">
                  <img
                    id="Chat_Comment_Div_img"
                    src="https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                    alt=""
                  />
                  <span className="text-red-700 font-bold Chat_Comment_Name">{comment.name}</span>
                </div>
                <div>
                  {authid === comment.authid && (
                    <span
                      onClick={() => {
                        deleteComments(comment.$id);
                      }}
                      className="cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can text-xl"></i>
                    </span>
                  )}
                </div>

              </div>

              <div id="Chat_Comment_Div_1">
                <div id="Chat_Comment">{comment.commentContent ? parse(comment.commentContent) : ''}</div>
              </div>
            </section>



            <div id="ReplyDiv" className="flex justify-end mt-3">
              <span
                className="cursor-pointer"
                onClick={() => {
                  // AddCommentTextarea(
                  //   comment.$id,
                  //   comment.commentContent,
                  //   post.$id,
                  //   comment.textAreaVisible
                  // );
                  setactiveTextArea((prev) => comment.$id)
                }}
              >
                Reply
              </span>
            </div>


            <div className={`${activeTextArea === comment.$id ? '' : 'hidden'}`}>
              <textarea
                name=""
                id={`id_${comment.$id}`}
                rows="4"
                value={replyComment}
                className="Chat_textArea"
                onChange={(e) => setreplyComment(e.target.value)}
              ></textarea>

              <Button
                onClick={() => {
                  if (comment.subComment.length > 100) return
                  CommentReply(
                    [
                      JSON.stringify({
                        sub: replyComment,
                        authid: authid,
                        name: name,
                      }),
                      ...comment.subComment,
                    ],
                    comment.$id,
                    comment.commentContent,
                    post.$id,
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
              {comment.subComment.map((sub, index) => {

                // console.log(id_For_Five_Mul)
                if (comment.$id != id_For_Five_Mul) {
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
                          comment.subComment,
                          comment.$id,
                          comment.commentContent,
                          post.$id,
                          index
                        );
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                  <span className="cursor-pointer" onClick={() => navigate(`/profile/${JSON.parse(sub).authid}`)}>{JSON.parse(sub).name}</span>
                  <p>{JSON.parse(sub).sub}</p>

                </div>
              })}
            </div>
            <button className={''} id="Chat_See_Replies" onClick={() => {

              setid_For_Five_Mul((prev) => comment.$id)
              const currentCommentID = comment.$id;
              if (currentCommentID !== id_For_Five_Mul && id_For_Five_Mul !== null) {
                setloadSubComments_Five_Mul((prev) => fixedReplies + 2)
              }
              if (loadSubComments_Five_Mul >= comment.subComment.length) return

              setloadSubComments_Five_Mul((prev) => prev + 3)

            }}>{`${(loadSubComments_Five_Mul >= comment.subComment.length && comment.$id === id_For_Five_Mul) || comment.subComment.length <= fixedReplies ? 'No Replies' : 'See Replies'}`}</button>
            <div>
              <small>{new Date(comment.$createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>


      <div className="flex justify-center gap-5">
        <span
          className="text-4xl cursor-pointer"
          onClick={() => {
            getComments(undefined, commentArr[0].$id);
          }}
        >
          {`<`}
        </span>
        <span
          className="text-4xl cursor-pointer"
          onClick={() => {
            getComments(commentArr[commentArr.length - 1].$id, undefined);
          }}
        >
          {`>`}
        </span>
      </div>
    </div>
  );
};

export default Chat;
