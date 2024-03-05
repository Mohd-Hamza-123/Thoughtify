import React, { useEffect, useRef } from "react";
import "./Chat.css";
import { ChatRTE, Button, TextArea } from "../index";
import { useForm } from "react-hook-form";
import realTime from "../../appwrite/realTime";
import parse from "html-react-parser";
import { useState } from "react";
import { useSelector } from "react-redux";

const Chat = ({ post }) => {
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
  };
  const AddCommentTextarea = (
    messageid,
    commentContent,
    postid,
    textAreaVisible
  ) => {
    realTime
      .updateComment({
        messageid,
        postid,
        commentContent,
      })
      .then((res) => { });
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
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div id="Chat">
      <form onSubmit={handleSubmit(Submit)}>
        <div>
          <ChatRTE
            control={control}
            name="commentContent"
            defaultValue={getValues("commentContent")}
          />
        </div>
        <div className="flex justify-end mt-3">
          <Button
            type="submit"
            className="border-1 border-solid border-black bg-black text-white p-2 rounded-md"
          >
            Your Opinion
          </Button>
        </div>
      </form>

      <div>
        {commentArr?.map((comment) => (
          <div key={comment.$id} id="Chat_Comment_Div">
            <div className="flex justify-between mb-5">
              <div className="flex gap-2">
                <img
                  id="Chat_Comment_Div_img"
                  src="https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <span className="text-red-700 font-bold">{comment.name}</span>
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
            <div>
              <div id="ReplyDiv" className="flex justify-end mt-3">
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    AddCommentTextarea(
                      comment.$id,
                      comment.commentContent,
                      post.$id,
                      comment.textAreaVisible
                    );
                  }}
                >
                  Reply
                </span>
              </div>

              <div>
                <textarea
                  name=""
                  id={`id_${comment.$id}`}
                  rows="4"
                  className="rounded-md mt-3 w-full border border-1 border-gray-500 border-solid p-3 outline-none resize-none"
                  onChange={(e) => setreplyComment(e.target.value)}
                ></textarea>

                <Button
                  onClick={() => {
                    CommentReply(
                      // [replyComment, ...comment.subComment],
                      [
                        JSON.stringify({
                          sub: replyComment,
                          authid: authid,
                        }),
                        ...comment.subComment,
                      ],
                      comment.$id,
                      comment.commentContent,
                      post.$id,
                      null
                    );
                  }}
                  className="border-2 border-slate-950 px-2 py-1 rounded-sm border-solid bg-slate-950 text-white mt-2"
                  value="Submit"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>

            <div>
              {comment.subComment.map((sub, index) => (
                <div
                  key={sub + index + Date.now()}
                  className="border border-solid border-black px-3 py-1 my-3 bg-black text-white "
                >
                  <p>{JSON.parse(sub).sub}</p>
                  {authid === JSON.parse(sub).authid && (
                    <button
                      className="border-2 border-solid border-red-700 px-1 mt-4"
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
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

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
